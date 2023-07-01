/**
 * Contains methods to render bounding boxes and text annotations on an image's (same as a single frame) detection.
 */
class Render {
	constructor(
		canvas,
		lineWidth,
		lineColor,
		font,
		textColor,
		textBackgoundColor
	) {
		this.canvas = canvas;
		this.font = font;
		this.lineWidth = lineWidth;
		this.lineColor = lineColor;
		this.textColor = textColor;
		this.textBackgoundColor = textBackgoundColor;
	}
	/**
	 * @summary renders a bounding box and text annotations for a detection
	 * @param {contextType} context - THe canvas context to render on.
	 * @param {Array<float>} bbox - A normalized to [0,1] bbox: [xmin, ymon, xmax, ymax].
	 * @param {float} score - Detections's  score value, val range [0,1].
	 * @param {float} classId - Class's index.
	 * @param {float} imageWidth - Input image's original width.
	 * @param {float} imageHeight - Input image's original height.
	 */

	renderBox = (context, bbox, score, className, imageWidth, imageHeight) => {
		context.beginPath();

		// render bounding box
		context.rect(
			bbox[0] * imageWidth,
			bbox[1] * imageHeight,
			(bbox[2] - bbox[0]) * imageWidth,
			(bbox[3] - bbox[1]) * imageHeight
		);
		context.fillStyle = this.lineColor;
		context.lineWidth = this.lineWidth;
		context.strokeStyle = this.lineColor;
		context.stroke();
		const annotationText = className + ' ' + (100 * score).toFixed(2) + '%';

		context.fillStyle = this.textBackgoundColor;
		const textHeight = parseInt(this.font, 10); // base 10
		context.font = this.font;
		const textWidth = context.measureText(annotationText).width;

		// render text background.
		const textX =
			bbox[0] * imageWidth + textWidth < imageWidth
				? bbox[0] * imageWidth
				: imageWidth - textWidth;
		const textY =
			bbox[1] * imageHeight - textHeight > 0
				? bbox[1] * imageHeight
				: bbox[1] * imageHeight + textHeight;

		context.fillRect(textX, textY - textHeight, textWidth, textHeight);

		// render text
		context.fillStyle = this.textColor;

		context.fillText(annotationText, textX, textY);
	};

	/**
	 * @summary renders a bounding box and text annotations for an array of detections
	 * @param {img} image - An element to render into the context. The specification permits any canvas image source,.
	 * @param {Array<Array<float>>} bboxes - An array with a bbox array per a detection. A bbox is 4 element array which holds normalized to [0,1] bbox: [xmin, ymon, xmax, ymax].
	 * @param {Array<float>} scores - An array with a score value per a detectiono.
	 * @param {Array<float>} classIndices - An array with a class index per a detectiono.
	 */

	renderOnImage = (
		segmentedImage,
		bboxes,
		scores,
		classIndices,
		classNames,
		imageWidth,
		imageHeight
	) => {
		const context = this.canvas.getContext('2d');

		this.canvas.width = imageWidth;
		this.canvas.height = imageHeight;

		// context.drawImage(image, 0, 0, imageWidth, imageHeight);
		tf.engine().startScope();

		let count1 = tf.memory().numTensors;
		if ((imageHeight > 0) & (imageWidth > 0)) {
			const resImage = tf.browser.toPixels(
				tf.image.resizeBilinear(segmentedImage, [imageHeight, imageWidth]),
				this.canvas
			);
			resImage.then(() => {
				bboxes.forEach((box, idx) =>
					this.renderBox(
						context,
						box,
						scores[idx],
						classNames[classIndices[idx]],
						imageWidth,
						imageHeight
					)
				);
			});
		}

		tf.engine().endScope();
		let count2 = tf.memory().numTensors;
		console.log('numTensors ', count1);
	};
}
export { Render };
