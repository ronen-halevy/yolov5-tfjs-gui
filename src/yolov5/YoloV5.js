class ProcMasks {
	palette = tf.tensor([
		[0xff, 0x38, 0x38],
		[0xff, 0x9d, 0x97],
		[0xff, 0x70, 0x1f],
		[0xff, 0xb2, 0x1d],
		[0xcf, 0xd2, 0x31],
		[0x48, 0xf9, 0x0a],
		[0x92, 0xcc, 0x17],
		[0x3d, 0xdb, 0x86],
		[0x1a, 0x93, 0x34],
		[0x00, 0xd4, 0xbb],
		[0x2c, 0x99, 0xa8],
		[0x00, 0xc2, 0xff],
		[0x34, 0x45, 0x93],
		[0x64, 0x73, 0xff],
		[0x00, 0x18, 0xec],
		[0x84, 0x38, 0xff],
		[0x52, 0x00, 0x85],
		[0xcb, 0x38, 0xff],
		[0xff, 0x95, 0xc8],
		[0xff, 0x37, 0xc7],
	]);

	cropMask = (masks, boxes) => {
		const [n, h, w] = masks.shape;
		const [xmin, ymin, xmax, ymax] = tf.split(
			boxes.expandDims([1]),
			[1, 1, 1, 1],
			-1
		);

		const r = tf.range(0, w, 1, xmin.dtype).expandDims(0).expandDims(0); // array [0.....,w-1] dim: [1,1,w]
		const c = tf.range(0, h, 1, xmin.dtype).expandDims(-1).expandDims(0); // array [0.....,h-1] dim: [1,h,1]

		// crop is masks pixels which are not inside a bbox.

		const crop = r
			.greaterEqual(xmin)
			.mul(r.lessEqual(xmax))
			.mul(c.greaterEqual(ymin))
			.mul(c.lessEqual(ymax));

		return masks.mul(crop); // ((r >= x1) * (r < x2) * (c >= y1) * (c < y2))
	};

	processMask = (protos, masksIn, bboxes, ih, iw) => {
		var [ch, mh, mw] = protos.shape;
		const protosCols = protos.reshape([ch, -1]);
		var masks = masksIn.matMul(protosCols).sigmoid().reshape([-1, mh, mw]);

		var downsampled_bboxes = bboxes.clone(); // $.extend({}, bboxes);
		// downsampled_bboxes = downsampled_bboxes.mul(160);

		var [xmin, ymin, xmax, ymax] = tf.split(
			downsampled_bboxes,
			[1, 1, 1, 1],
			-1
		);
		downsampled_bboxes = tf.concat(
			[
				xmin.mul(masks.shape[1]),
				ymin.mul(masks.shape[2]),
				xmax.mul(masks.shape[1]),
				ymax.mul(masks.shape[2]),
			],
			-1
		);
		return this.cropMask(masks, downsampled_bboxes);
	};
	masks = (maskPatterns, colors, preprocImage, alpha) => {
		return tf.tidy(() => {
			colors = colors.expandDims(-2).expandDims(-2); //shape(n,1,1,3)
			maskPatterns = tf.cast(maskPatterns, 'float32'); // (n,h,w,1)

			const masksColor = maskPatterns.mul(colors.mul(alpha)); // shape(n,h,w,3)
			const invAlphMasks = tf.cumprod(
				tf.scalar(1).sub(maskPatterns.mul(alpha)),
				0
			); // shape(n,h,w,1) where h=w=160

			const mcs = tf.sum(masksColor.mul(invAlphMasks), 0).mul(2); // mask color summand shape(n,h,w,3)
			const [invAlphMasksHead, invAlphMasksTail] = tf.split(
				invAlphMasks,
				[invAlphMasks.shape[0] - 1, 1],
				0
			);
			invAlphMasksHead.dispose();
			preprocImage = preprocImage
				.squeeze(0)
				.mul(invAlphMasksTail.squeeze(0))
				.add(mcs);

			return preprocImage;
		});
	};

	run = (
		preprocImage,
		protos,
		selMasksCoeffs,
		selBboxes,
		selclassIndices,
		modelWidth,
		modelHeight
	) => {
		return tf.tidy(() => {
			var maskPatterns = this.processMask(
				protos.squeeze(0),
				selMasksCoeffs,
				selBboxes,
				modelWidth,
				modelHeight
			);
			protos.dispose();
			selMasksCoeffs.dispose();

			maskPatterns = tf.image
				.resizeBilinear(maskPatterns.expandDims(-1), [640, 640])
				.greater(0.5);

			const ind = selclassIndices.mod(this.palette.shape[0]);
			const colorPalette = this.palette.gather(tf.cast(ind, 'int32')).div(255);
			ind.dispose();
			// ronen - tbd todo add to config param:
			const alpha = 0.5;
			maskPatterns = this.masks(
				maskPatterns,
				colorPalette,
				preprocImage,
				alpha
			);
			colorPalette.dispose();

			return maskPatterns;
		});
	};
}

class YoloV5 {
	constructor(model, nClasses, scoreTHR, iouTHR, maxBoxes) {
		this.model = model;
		this.nClasses = nClasses;
		this.scoreTHR = scoreTHR;
		this.iouTHR = iouTHR;
		this.maxBoxes = maxBoxes;
		this.procMasks = new ProcMasks();
	}

	setScoreTHR = (val) => {
		this.scoreTHR = val;
	};
	setIouTHR = (val) => {
		this.iouTHR = val;
	};

	setMaxBoxes = (val) => {
		this.maxBoxes = val;
	};

	setModelParams = (model, nClasses) => {
		this.model = model;
		this.nClasses = nClasses;
	};
	xywh2xyxy = (x) => {
		// Convert nx4 boxes from [x, y, w, h] to [x1, y1, x2, y2] where xy1=top-left, xy2=bottom-right
		return tf.tidy(() => {
			var [xy, wh] = tf.split(x, [2, 2], -1);
			var xyMin = xy.sub(wh.div(2));
			var xyMax = xy.add(wh.div(2));
			return tf.concat([xyMin, xyMax], -1);
		});
	};
	predict = (preprocImage) => {
		return tf.tidy(() => {
			var [protos, preds] = this.model.predict(preprocImage);
			const nm = 32;

			preds = preds.squeeze(0);
			const nc = preds.shape[1] - nm - 5; // n of classes
			// const mi = 5 + nc; // mask start index

			var axis = -1;
			var [bboxes, confidences, classProbs, masksCoeffs] = tf.split(
				preds,
				[4, 1, nc, nm],
				axis
			);
			preds.dispose();

			var classIndices = classProbs.argMax(axis);
			classProbs = classProbs.max(axis);
			confidences = confidences.squeeze(axis);
			const scores = confidences.mul(classProbs);
			bboxes = this.xywh2xyxy(bboxes);

			classProbs.dispose();
			confidences.dispose();
			return [protos, bboxes, classIndices, scores, masksCoeffs];
		});
	};

	detectFrame = async (imageFrame) => {
		// tf.engine cleans intermidiate allocations avoids memory leak - equivalent to tf.tidy
		tf.engine().startScope();

		const imageHeight = 640;
		const imageWidth = 640;

		const preprocImage = tf.tidy(() => {
			return tf.image
				.resizeBilinear(tf.browser.fromPixels(imageFrame), [
					imageHeight,
					imageWidth,
				])
				.div(255.0)
				.expandDims(0);
		});

		const [protos, bboxes, classIndices, scores, masksCoeffs] =
			this.predict(preprocImage);

		const [selBboxes, selScores, selclassIndices, selMasksCoeffs] = await nms(
			bboxes,
			scores,
			classIndices,
			masksCoeffs,
			this.iouTHR,
			this.scoreTHR,
			this.maxBoxes
		);
		scores.dispose();
		if (selBboxes.shape[0] == 0) {
			console.log('null');
			tf.engine().endScope();

			return null;
		}

		const maskPatterns = this.procMasks.run(
			preprocImage,
			protos,
			selMasksCoeffs,
			selBboxes,
			selclassIndices,
			imageFrame.width,
			imageFrame.height
		);

		const bboxesArray = selBboxes.array();
		const scoresArray = selScores.array();
		const classIndicesArray = selclassIndices.array();
		const masksResArray = maskPatterns.array();

		tf.engine().endScope();

		// conversion to array is asunc:
		var reasultArrays = Promise.all([
			bboxesArray,
			scoresArray,
			classIndicesArray,
			masksResArray,
		]);

		return reasultArrays;
	};
}

const nms = (
	bboxes,
	scores,
	classIndices,
	masks,
	iouTHR,
	scoreTHR,
	maxBoxes
) => {
	const nmsPromise = new Promise((resolve) => {
		const nmsResults = tf.image.nonMaxSuppressionAsync(
			bboxes,
			scores,
			maxBoxes,
			iouTHR,
			scoreTHR
		);
		resolve(nmsResults);
	}).then((nmsResults) => {
		var selectedBboxes = bboxes.gather(nmsResults);
		var selectedClasses = classIndices.gather(nmsResults);
		var selectedScores = scores.gather(nmsResults);
		var selectedMasks = masks.gather(nmsResults);

		var reasultArrays = Promise.all([
			selectedBboxes,
			selectedScores,
			selectedClasses,
			selectedMasks,
		]);

		return reasultArrays;
	});

	return nmsPromise;
};

const createModel = (modelUrl, classNamesUrl) => {
	const modelPromise = tf.loadGraphModel(modelUrl);
	const classNamesPromise = fetch(classNamesUrl).then((x) => x.text());

	const promise = Promise.all([modelPromise, classNamesPromise]);
	return promise;
};

export { YoloV5, createModel };
