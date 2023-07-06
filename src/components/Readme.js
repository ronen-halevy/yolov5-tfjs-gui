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
				<h3>Introduction</h3> <br />
				This app demonstrates an original Javascript+ Tensorflow-JS
				implementation of `Ultralytics`
				<a href='https://github.com/ultralytics/yolov5'>YoloV5 Repositoy.</a>
				<br />
				The app classifies object, assigns them with bounding boxes and performs
				instance segmentation.
				<br />
				<br />
				<h3>A brief description</h3>
				Yolo is a CNN-based object detection algorithm. Acronym of `Y`ou `O`nly
				`L`ook `O`nce, indicates that prediction requires a single pass of the
				input, as opposed to algorithms such as R-CNN which need an preceding
				pass for ROI search. The single pass results in better performance in
				terms of computation load, and thus process time.
				<br /> <br />
				<h3>A brief user's guide</h3> The app is set with default
				configurations, so you are ready to press play and run the default video
				selection!
				<br />
				Then, you may either load images or video files from local storage or
				select a video from a list - the selected video will be fetched by its
				URL.
				<br /> <br />
				<h3>The UI </h3>
				The UI is implemented by ReactJS. It consists of 5 sections: an
				accordion Readme section, 4 mini-buttons panel sections, and the
				rendering canvas, placed on the bottom. <br /> <br />
				<h4>Mini-buttons panels</h4>
				The 4 mini-button panels, are described next.
				<br /> <br />
				<h4>Model Selection panel</h4>
				<br />
				<h5>Select a model button</h5>
				Yolov5 has 5 versions - n (nano), s(small), m(medium),l (large), x (xl),
				which offer increaded computations with better accuracy,but slower
				performance. Selection is between YoloV5n,s & m. You should probably
				avoid the heavier versions if running on a lightweight processor, e.g. a
				smartphone. The model selection is bundeled with the selection of
				weights, i.e. `YoloV5sCoco``selection option refers to `YoloV5s` with
				Coco trained weights. (`Coco`` dataset is a commonly used large-scale
				object detection dataset with 80 object classes).
				<br />
				<h5>Load button</h5>
				The selected model and weights are loaded only after pressing this
				button.
				<br />
				<br />
				<h4>Data Source Selection panel</h4>
				<br /> <br />
				<h5>Data source button</h5>
				This button selects the source of consumed data, i.e. the input image or
				video files. Selection is between uploading from local storage, or
				fetching, (currently videos only), from video sites.
				<br /> <br />
				<h5>Input Selection button</h5>
				According to data source selection, the input selection will present
				either selection from a url data source or from selection of file from
				local storage.
				<br />
				<strong>Url Selection: </strong> The button cyclically moves the
				selection to the next video URL on the list. To keep it compact, the URL
				is not presented, but only a short-form name of the video. The
				item&rsquo;s index is displayed as a badge in the upper right corner. A
				blower badge credits the video providor website.
				<br />
				<strong>File Selection: </strong> Selects an image or video file from
				local storage.
				<br /> <br />
				<h4>Configuration Panel</h4>
				The panel consists of 3 configuration buttons. The buttons&rsquo; effect
				is immediate, even while a video play. A button click cyclically
				increments the value.
				<br /> <br />
				<h5>ScoreTHLD button </h5>
				This button sets the threshold for the detection confidence score. The
				value range is between 0 and 1. Detections with scores below thresholds
				are filtered out. The tradeoff is between False detections for lower
				thresholds, and missed detections for higher thresholds.
				<br /> <br />
				<h5>IouTHLD button </h5>
				This button sets the threshold for Iou, an acronym for Intersection Over
				Union. Iou measures the amount of overlap between adjacent bounding
				boxes. The value range is between 0 and 1. Detections with scores below
				thresholds are filtered out. The lower the IOU threshold is, the less
				overlapping boxes are displayed. The tradeoff is between missing
				detections of close objects for lower thresholds and receiving false
				duplicated detections for higher thresholds.
				<br /> <br />
				<h5>Max Boxes button </h5>
				This button sets the max number of bounding boxes.
				<br /> <br />
				<h4>Video Control panel</h4>
				<br />
				<h5>Display Mode button </h5>
				Selects between `composed` mode, which displays the original with bboxes
				and segmentation masks overlay, and `mask` which displays the overlays
				only.
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
				<h4> Canvas panel </h4>
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
				<h5>WebGL Acceleration</h5>
				Being Tensorflow-JS based, the application automatically recognizes the
				platform's backend, and can exploit webGL acceleration accordingly.
				<br />
				<br />
				<br />
				<br />
				Please contact me for feedback!
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
