import React, { Component } from 'react';

import SelectModelButtons from './SelectModelButtons';

import configModel from '../config/configModel.json';
import { createModel } from '../yolo/YoloV5.js';

export default class ModelSelectionPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadedModel: '',
			// loadingMessage: 'No Model Loaded!',
			loadSpinner: false,
			loadProgress: 0,
		};
		this.modelsTable = configModel.models;
		// take first in list as a default:
		this.selectedModel = Object.keys(this.modelsTable)[0];
	}

	componentDidMount() {
		this.onLoadModel();
	}

	setModel = (results) => {
		const { selectedModel } = results;
		this.selectedModel = selectedModel;
	};

	onProgress = (fractions) => {
		this.setState({ loadProgress: (fractions * 100).toFixed(2) });
	};

	onLoadModel = async () => {
		if (this.props.videoStreamOn) {
			alert(`Can't Load while streaming`); // if streaming video or webcam
			return;
		}

		this.setState({
			// loadingMessage: 'Loading Model...',
			loadSpinner: true,
		});

		const modelConfig = this.modelsTable[this.selectedModel];
		const { modelUrl, classNamesUrl, ...rest } = modelConfig;

		const [model, classNames] = await createModel(
			modelUrl,
			classNamesUrl,
			this.onProgress
		);
		this.setState({
			loadedModel: this.selectedModel,

			// loadingMessage: this.selectedModel + ' is ready!',
			loadSpinner: false,
			loadProgress: 0,
		});
		// prevent leak - dispose previous model if exists:
		if (this.model) {
			this.model.dispose();
		}
		this.model = model;

		this.classNames = classNames.split(/\r?\n/);
		this.nclasses = this.classNames.length;
		this.props.onLoadModel(this.model, this.classNames);
	};

	render() {
		return (
			<div className='selectModel row mt-3 '>
				<div className=' col-4  text-center '>
					<SelectModelButtons
						modelsTable={this.modelsTable}
						setModel={this.setModel}
					/>
				</div>
				<div className=' col-4  text-center space holder'></div>

				<div className=' col-4 text-center '>
					<span
						className='btn btn-dark btn-lg  position-relative badge start-0'
						onClick={this.onLoadModel}
					>
						Load
						<span className='position-absolute top-0  start-50 translate-middle badge rounded-pill bg-danger'>
							{this.state.loadedModel}
						</span>
						{this.state.loadSpinner && (
							<div className='col'>
								<div className='spinner-border' role='status'>
									<span className='sr-only'></span>
								</div>
								{this.state.loadProgress}%
							</div>
						)}
					</span>
				</div>
			</div>
		);
	}
}
