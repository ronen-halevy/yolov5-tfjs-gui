import React from 'react';
export default class Readme extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='accordion-body'>
				<h2>Welcome to the YoloV5 Tfjs Demo!</h2>
				<br /> <br />
				<h3>TL-DR</h3>
				The app is ready to go - clicking canvas starts execution with defaults.
				<br />
				<br />
				<h3>Introduction</h3> <br />
				This app classifies objects, marks them with bounding boxes and instance
				segmentation colored masks. This implementation uses the{' '}
				<i>Tensorflow-JS</i>
				framework, and is based on <i>Ultralytics</i>{' '}
				<a href='https://github.com/ultralytics/yolov5'>YoloV5 repository</a>
				<br />
				<br />
				<h3>A brief on Yolo</h3>
				Yolo is a CNN-based object detection algorithm. The acronym of <b>Y</b>
				ou <b>O</b>nly <b>L</b>ook <b>O</b>nce, refers to the single pass
				prediction process, as opposed to algorithms such as R-CNN, which uses
				an extra pass for ROI search. A single pass results better speed, which
				is essential for real time video with larger fps rate. <br /> <br />
				<h3>The UI </h3>
				The UI is implemented using <i>ReactJS</i> with <i>Bootstrap</i> for
				styling. The interface consists 4 panel sections detailed next <br />{' '}
				<br />
				<h4>Panel Sections</h4>
				<br />
				<h4>1. Model Selection panel</h4>
				<br />
				Yolov5 comes with 5 flavors, from the lightest Yolov5n (nano) to Yolov5x
				(xl). The trade-off is accuracy versus computation load and speed. The
				lightest and fastest is Yolov5n (nano) while the heaviest is Yolov5x
				(xl). To avoid lags on video runs, select lighter flavors on lightweight
				processors.
				<br />
				<b>Note: </b>A selected model is downloaded only after clicking{' '}
				<b>Load</b> button.
				<br />
				<br />
				<h4>2. Data Source Selection panel</h4>
				<br />
				Supported Input Data Sources are:
				<ul>
					<li>Video from a list (fetched from from video websites)</li>
					<li>Uploaded video from local device</li>
					<li>Uploaded image from local device</li>
				</ul>
				<br />
				<h4>3. Configuration Panel</h4>
				<br />
				The panel consists of 3 configuration buttons. The buttons&rsquo; effect
				is immediate, even while a video play.
				<br /> <br />
				<h5>ScoreTHLD button </h5>
				This button sets the threshold for the detection confidence score. The
				value range is between 0 and 1. Detections with scores below thresholds
				are filtered out. The tradeoff is between False detections for lower
				thresholds, and missed detections for higher thresholds.
				<br /> <br />
				<h5>IouTHLD button </h5>
				This button sets the threshold for Iou, an acronym for <b>I</b>
				ntersection <b>O</b>ver
				<b>U</b>nion. Iou measures the amount of overlap between adjacent
				bounding boxes. The value range is between 0 and 1. Detections with
				scores below thresholds are filtered out. The lower the IOU threshold
				is, the less overlapping boxes are displayed. The tradeoff is between
				missing detections of close objects for lower thresholds and receiving
				false duplicated detections for higher thresholds.
				<br /> <br />
				<h5>Max Boxes button </h5>
				This button sets the max number of bounding boxes.
				<br /> <br />
				<h4>4. Video Control panel</h4>
				<br />
				<h5>Display Mode button </h5>
				Selects between <b>composed</b>` mode, which displays the original with
				bboxes and segmentation masks overlay, and <b>mask</b> which displays
				overlays only.
				<br /> <br />
				<h5>Speed button </h5>
				Selects between 3 video play speeds.
				<br /> <br />
				<h5>Fps and seconds counter </h5>
				A small display of fps and running seconds. Fps may vary according to
				the platform, model type, and data.
				<br /> <br />
				<h5>Range Progress Bar </h5>
				Permits manual skips through.
				<br /> <br />
				<h5>Scale button </h5>
				Scales canvas size.
				<br /> <br />
				<h4> Canvas </h4>
				Both images and videos are rendered on the same canvas. Touching (or
				clicking) the canvas surface triggers <b>play</b> and <b>stop</b> of
				process.
				<br /> <br />
				<h3>The algorithmic engine</h3>
				The algorithmic engine is implemented using Tensorflow JS, the Java
				Script variant of Tensorflow.
				<br />
				The algorithm runs solely on the browser. <br />
				Compared to a client-server architecture, the setup is lighter, the
				device is independent, but lacking computation power, performance may
				potentially be inferior. <br />
				<br />
				<h6>WebGL Acceleration</h6>
				Being Tensorflow-JS based, the application automatically recognizes the
				platform's backend, and can exploit webGL acceleration accordingly.
				<br />
				<br />
				<br />
				<br />
				Ronen Halevy
				<br />
				ronen567@gmail.com
				<br />
				<br />
				<br />
				Errata:
				<br />
				<ol>None</ol>
			</div>
		);
	}
}
