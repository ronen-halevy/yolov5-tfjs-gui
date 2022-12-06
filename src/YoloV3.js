import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

tf.setBackend('webgl');

// import LoadModel from './LoadModel.js';
import yoloDecode from './yoloDecode.js';
import yoloNms from './yoloNms.js';
import Draw from './draw.js';
import { image } from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

import configData from './config.json';

const imageHeight = 416;
const imageWidth = 416;

const inputImageRenderWidth = 200;
const inputImageRenderHeight = 200;

let nclasses = 7; // TODO!!
let yoloMaxBoxes = 100;
let nmsIouThreshold = 0.5;
let nmsScoreThreshold = 0.1;

const MODEL_URL =
	'https://raw.githubusercontent.com/ronen-halevy/yolov3-tfjs/master/models/test_temp/model.json';

const ANCHOR_URL =
	'https://raw.githubusercontent.com/ronen-halevy/yolov3-tfjs/master/data/anchors_coco.json';

export const YoloV3 = () => {
	const videoRef = useRef(null);
	const photoRef = useRef(null);
	const canvasRefVideo = useRef(null);
	const canvasRefImage = useRef(null);

	const [selectedVidFile, setSelectedVidFile] = useState('');
	const [selectedImageFile, setSelectedImageFile] = useState('');
	const [imageUrl, setImageUrl] = useState(null);
	const [vidFileName, setVidFileName] = useState(null);
	const [imageFileName, setImageFileName] = useState(null);

	const [model, setModel] = useState(null);
	const [anchors, setAnchors] = useState(null);

	const [jsxVisibility, setJsxVisibility] = useState('invisible');
	let photo = photoRef.current;

	let classesDir = {
		1: {
			name: 'Kangaroo',
			id: 1,
		},
		2: {
			name: 'Other',
			id: 2,
		},
	};

	useEffect(() => {
		getVideo();
	}, [videoRef]);

	const getVideo = () => {
		navigator.mediaDevices
			.getUserMedia({ video: {} })
			.then((stream) => {
				let video = videoRef.current;
				video.srcObject = stream;
				video.play();
			})
			.catch((err) => {
				console.error('error:', err);
			});
	};

	const makeDetectFrame = (isVideo) => {
		const detectFrame = (model, imageFrame) => {
			tf.engine().startScope();
			const imageTensor = imagePreprocess(imageFrame);
			const model_output_grids = model.predict(imageTensor);

			// Decode predictions: combines all grids detection results
			let [bboxes, confidences, classProbs] = yoloDecode(
				model_output_grids,
				nclasses,
				anchors
			);
			let axis = -1;
			let classIndices = classProbs.argMax(axis);
			classProbs = classProbs.max(axis);
			confidences = confidences.squeeze(axis);
			let scores = confidences.mul(classProbs);

			const nmsResult = yoloNms(
				bboxes,
				scores,
				classIndices,

				yoloMaxBoxes,
				nmsIouThreshold,
				nmsScoreThreshold
			);

			nmsResult.then((reasultArrays) => {
				let [selBboxes, scores, classIndices] = reasultArrays;
				let canvas = isVideo ? canvasRefVideo.current : canvasRefImage.current;
				var draw = new Draw(canvas);
				draw.drawOnImage(imageFrame, selBboxes, scores, classIndices);
				if (isVideo) {
					requestAnimationFrame(() => {
						detectFrame(model, imageFrame);
					});
				}
				tf.engine().endScope();
			});
		};
		return detectFrame;
	};

	const imagePreprocess = (image) => {
		const imgTensor = tf.browser.fromPixels(image);
		var resized = tf.image.resizeBilinear(imgTensor, [imageHeight, imageWidth]);
		var tensor = resized.expandDims(0).toFloat();
		tensor = tensor.div(255);
		return tensor;
	};

	// const takePhoto = () => {
	// 	let photo = photoRef.current;
	// 	console.warn(strip);
	// 	const data = photo.toDataURL('image/jpeg');

	// 	console.warn(data);
	// 	const link = document.createElement('a');
	// 	link.href = data;
	// 	link.setAttribute('download', 'myWebcam');
	// 	link.innerHTML = `<img src=document.getElementById(data) alt='thumbnail'/>`;
	// 	strip.insertBefore(link, strip.firstChild);
	// };

	const playVideoFile = (file) => {
		var type = file.type;
		let video = videoRef.current;
		var URL = window.URL || window.webkitURL;
		var fileURL = URL.createObjectURL(file);
		video.src = fileURL;
		video.play();
	};

	// create image file read promise
	function fileToDataUri(field) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.addEventListener('loadend', () => {
				resolve(reader.result);
			});
			reader.readAsDataURL(field);
		});
	}
	/* Use Effect Hooks:*/

	useEffect(() => {
		const modelPromise = tf.loadLayersModel(MODEL_URL);
		const anchorsPromise = fetch(ANCHOR_URL).then((response) =>
			response.json()
		);
		Promise.all([modelPromise, anchorsPromise]).then((values) => {
			setModel(values[0]);
			setAnchors(values[1].anchor);
			// model and anchors ready. All ready to go - so unhide gui
			setJsxVisibility('visible');
		});
	}, []);

	// init video session when
	useEffect(() => {
		if (selectedVidFile) {
			playVideoFile(selectedVidFile);
			var isVideo = true;
			var imageFrame = videoRef.current;

			// const modelPromise = LoadModel();
			const detectFrame = makeDetectFrame(isVideo);

			let promiseVideoMetadata = new Promise((resolve, reject) => {
				videoRef.current.onloadedmetadata = () => {
					resolve();
				};
			});
			promiseVideoMetadata.then(() => {
				detectFrame(model, imageFrame);
			});
		}
	}, [selectedVidFile]);

	useEffect(() => {
		if (selectedImageFile) {
			var isVideo = false;
			var imageFrame = new window.Image();
			var promise = fileToDataUri(selectedImageFile);
			promise.then((contents) => {
				imageFrame.src = contents;
			});
			const detectFrame = makeDetectFrame(isVideo);
			imageFrame.addEventListener('load', async () => {
				detectFrame(model, imageFrame);
			});
		}
	}, [selectedImageFile]);

	const onChangeImageFile = (event) => {
		setImageUrl(URL.createObjectURL(event.target.files[0]));
		setImageFileName(event.target.value);

		setSelectedImageFile(event.target.files[0]);
		event.target.value = ''; /* Forces onChange event if same file is uploaded*/
	};

	const onChangeVidFile = (event) => {
		setSelectedVidFile(event.target.files[0]);
		setVidFileName(event.target.value);
		event.target.value = ''; /* Forces onChange event if same file is uploaded*/
	};

	const onChangeFile = (event) => {
		const filename = event.target.value;
		if (filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
			onChangeImageFile(event);
		} else {
			onChangeVidFile(event);
		}
	};

	return (
		<div className='container '>
			<h2 className='text-center'>Yolo TfJs Demo</h2>

			{/* set invisible before model loaded - at start, practically not noticed */}
			<div className={jsxVisibility}>
				<div className='row'>
					{/* Hack Explained: filename is changed to '' to let onChange event even for
					same. To avoid "No file chosen" text by input, it is set
					invisible+label */}

					<input
						className=' invisible'
						id='files'
						type='file'
						onChange={onChangeFile}
						accept='video/*, image/*'
					/>

					<div className='col-4'></div>
					<label htmlFor='files' className='btn btn-success col-4'>
						Select Image/Video File
					</label>
				</div>
				<div className='row justify-content-center'>
					<b className='col-4'>{vidFileName}</b>
				</div>
				<div className='row justify-content-center'>
					<b className='col-4'>{imageFileName}</b>
				</div>
			</div>

			<div className='row'>
				<div className='mb-3'></div>
				<div className='col-6 '>
					{vidFileName && (
						<video
							style={{ height: '200px', width: '200px' }}
							className='size'
							autoPlay
							playsInline
							muted
							ref={videoRef}
							width={String(imageWidth)}
							height={String(imageHeight)}
							id='frame'
							controls
						/>
					)}
				</div>
				<div className='col-6'>
					{/* Hide image element before any image is selected */}
					{imageFileName && (
						<img
							className=''
							id='myimage'
							src={imageUrl}
							alt='image'
							width={String(inputImageRenderWidth)}
							height={String(inputImageRenderHeight)}
						/>
					)}
				</div>
			</div>
			<div className='gap-3'></div>

			<div className='row'>
				<div className='col-6'>
					<canvas className='video' ref={canvasRefVideo} width='' height='' />
				</div>

				<div className='col-6'>
					<canvas className='image' ref={canvasRefImage} width='' height='' />
				</div>
			</div>
		</div>
	);
};

export default YoloV3;