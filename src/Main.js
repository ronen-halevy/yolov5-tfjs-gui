import React, { Component } from 'react';
import Accordion from './components/Accordion';
import ModelSelectionPanel from './components/ModelSelectionPanel';
import ConfigurationsPanel from './components/ConfigurationsPanel';
import DataSourceSelectionPanel from './components/DataSourceSelectionPanel';
import { VideoControlPanel } from './components/VideoControlPanel';

import configNms from './config/configNms.json';

// import cdn module:
import { YoloV5 } from './yolo/YoloV5.js';

export class Main extends Component {
	constructor(props) {
		super(props);
		this.title = ''; // vid/img display title - currently unused
		this.dataUrl = '';
		this.dataType = '';
		this.state = {
			classNames: '',
			videoStreamOn: false,
		};
		this.yoloCreated = false;
	}

	detectFrame = (frame) => {
		return this.yoloV5.detectFrame(frame);
	};

	onLoadModel = (model, classNames) => {
		// create object only once. otherwise, just set params
		if (!this.yoloCreated) {
			// note: configNms values are expected to be overrided by config component on init:
			this.yoloV5 = new YoloV5(
				model,
				classNames.length,
				configNms.scoreTHR,
				configNms.iouTHR,
				configNms.maxBoxes
			);
			this.yoloCreated = true;
		} else {
			this.yoloV5.setModelParams(model, classNames.length);
		}
		this.setState({ classNames: classNames });
	};

	setScoreTHR = (val) => {
		this.yoloV5.setScoreTHR(val);
	};
	setIouTHR = (val) => {
		this.yoloV5.setIouTHR(val);
	};
	setMaxBoxes = (val) => {
		this.yoloV5.setMaxBoxes(val);
	};

	onClickSetDataSource = (url, type, title) => {
		this.setState({ title: title });
		this.setState({ dataUrl: url });
		this.dataUrl = url;
		this.dataType = type;
	};

	streamOnOff = (state) => {
		this.setState({ videoStreamOn: state });
	};
	modelSelectionPanel = () => {
		return (
			<div className='model  border border-1 border-secondary position-relative bg-light'>
				<ModelSelectionPanel
					onLoadModel={this.onLoadModel}
					videoStreamOn={this.state.videoStreamOn}
				/>
			</div>
		);
	};
	configurationsPanel = () => {
		return (
			<div className='configButtons border border-1 border-secondary position-relative  bg-light'>
				<div className='row mb-2'>
					{/* send configs updates not before object is constructed */}
					{this.yoloCreated && (
						<ConfigurationsPanel
							setScoreTHR={this.setScoreTHR}
							setIouTHR={this.setIouTHR}
							setMaxBoxes={this.setMaxBoxes}
						/>
					)}
				</div>
			</div>
		);
	};

	videoControlPanel = () => {
		return (
			<div className='col  border border-1 border-secondary bg-light '>
				<div className='row mb-2'>
					<VideoControlPanel
						streamOnOff={this.streamOnOff}
						detectFrame={this.detectFrame}
						classNames={this.state.classNames}
						inputUrl={{ url: this.dataUrl, type: this.dataType }}
					/>
				</div>
			</div>
		);
	};

	render() {
		const {} = this.props;
		return (
			<div className='container '>
				<h2 className='text-center mb-1 mt-2'>Serverless Image Segmentation</h2>
				<h5 className='text-center mb-1 mt-2'>A YoloV5 Tfjs Demo</h5>
				<Accordion />

				<div className='col '>
					<div className=' row text-center'>
						<div className=' col'>Model Selection</div>
					</div>
					{/* {!this.state.videoStreamOn ?  */}
					<this.modelSelectionPanel />
					{/* : null} */}
					<div className=' row text-center'>
						<div className=' col'>Data Source Selection </div>
					</div>
					<div className='dataSource border border-1 border-secondary position-relative bg-light'>
						<DataSourceSelectionPanel
							onClickSetDataSource={this.onClickSetDataSource}
						/>
					</div>
					<div className=' row text-center'>
						<div className=' col'>Configurations </div>
					</div>
					<this.configurationsPanel />
				</div>
				<div className=' row text-center'>
					<div className=' col'>Video Control</div>
				</div>
				<this.videoControlPanel />
			</div>
		);
	}
}
