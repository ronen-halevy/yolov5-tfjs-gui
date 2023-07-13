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
				This app classifies objects, marks them with bounding boxes and instance
				segmentation colored masks. Both videos and still images are supported.
				Click canvas to start execution with default setup.
				<br />
				<br />
				<h3>Credits First</h3> <br />
				Yolov5 implementation is based on <i>Ultralytics</i>{' '}
				<a href='https://github.com/ultralytics/yolov5'>YoloV5 repository</a>
				<br />
				<br />
				<h3>A brief on Yolo</h3>
				Yolo is a CNN-based object detection algorithm. The acronym of{' '}
				<i>You Only Look Once</i>, indicates a single prediction pass process,
				as opposed to other algorithms (such as R-CNN), which require an
				additional pass for ROI search. A single pass results in better
				performance in terms of speed, essential for higher fps real time video
				detection process. <br /> <br />
				<h3>The UI </h3>
				The interface consists 4 panel sections detailed next. <br /> <br />
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
				The panel consists of 3 configuration buttons. The buttons are
				interactive.
				<br /> <br />
				<h5>ScoreTHLD button </h5>
				This button sets the threshold for the detection confidence score. The
				value range is between 0 and 1. Detections with scores below thresholds
				are filtered out. The tradeoff is between False detections for lower
				thresholds, and missed detections for higher thresholds.
				<br /> <br />
				<h5>IouTHLD button </h5>
				This button sets the <i>Iou</i> threshold. <i>Iou</i>, an acronym for{' '}
				<i>Intersection Over Union</i>, measures the amount of overlap between
				adjacent bounding boxes. The threshold value ranges between 0 - no
				overlap is permitted, and 1 - full overlap is permitted. In case of{' '}
				<i>Iou</i> scores above threshold, the object with smaller detection
				confidence is ignored. So, tradeoff is between missing detections of
				close objects on lower thresholds, and false duplicated detections on
				higher thresholds.
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
				Touching (or clicking) the canvas surface triggers <b>play</b> and{' '}
				<b>stop</b> of process.
				<br /> <br />
				<h3>Implementation Notes</h3>
				<br />
				<h4>The UI</h4>
				The UI is implemented using <i>ReactJS</i> with <i>Bootstrap</i> for
				styling
				<br />
				<br />
				<h3>The algorithmic engine</h3>
				The algorithmic engine is implemented using <i>Tensorflow-JS</i>, the
				Java Script variant of Tensorflow.
				<br />. It's a serverless implementation, as the algorithm runs solely
				on the browser. <br />
				Compared to a client-server architecture, the setup is lighter, the
				device is independent, but lacking computation power, the performance
				may be significantly inferior. <br />
				<br />
				<h6>WebGL Acceleration</h6>
				<i>Tensorflow-JS</i> based, the application automatically recognizes the
				platform's backend, and can exploit <i>webGL</i> acceleration
				accordingly.
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
