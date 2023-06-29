import React, { Component } from 'react';

import SelectModelButtons from './SelectModelButtons';

import configModel from '../config/configModel.json';
import { createModel } from '../yolov5/YoloV5.js';

export default class ModelSelectionPanel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadedModel: '',
			loadedWeights: '',
			loadingMessage: 'No Model Loaded!',
			loadSpinner: false,
		};
		this.modelsTable = configModel.models;
		// take first in list as a default:
		this.selectedModel = Object.keys(this.modelsTable)[0];
		this.selectedWeights = Object.keys(this.modelsTable[this.selectedModel])[0];
	}

	componentDidMount() {
		this.onLoadModel();
	}

	setModelAndWeights = (results) => {
		const { selectedModel, selectedWeights } = results;
		// this.setState({
		console.log(this.selectedModel, this.selectedWeights);

		this.selectedModel = selectedModel;
		this.selectedWeights = selectedWeights;
	};

	onLoadModel = () => {
		this.setState({ loadingMessage: 'Loading Model...', loadSpinner: true });

		const modelConfig =
			this.modelsTable[this.selectedModel][this.selectedWeights];
		const { modelUrl, classNamesUrl, ...rest } = modelConfig;

		createModel(modelUrl, classNamesUrl).then((res) => {
			this.setState({
				loadedModel: this.selectedModel,
				loadedWeights: this.selectedWeights,

				loadingMessage:
					this.selectedModel + ' + ' + this.selectedWeights + ' is ready!',
				loadSpinner: false,
			});
			this.model = res[0];
			this.classNames = res[1].split(/\r?\n/);
			this.nclasses = this.classNames.length;
			this.props.onLoadModel(this.model, this.classNames);
		});
	};

	render() {
		return (
			<div>
				<div className='selectModelAndDataset row mt-2'>
					<div className='col-4  text-center '>
						<span
							className='btn btn-dark btn-lg  position-relative badge start-0'
							onClick={this.onLoadModel}
						>
							Load
							<span className='position-absolute top-0  start-50 translate-middle badge rounded-pill bg-danger'>
								{this.state.loadedModel}+{this.state.loadedWeights}
							</span>
							{this.state.loadSpinner && (
								<div className='spinner-border' role='status'>
									<span className='sr-only'></span>
								</div>
							)}
						</span>
					</div>
					<SelectModelButtons
						modelsTable={this.modelsTable}
						setModelAndWeights={this.setModelAndWeights}
					/>
				</div>
			</div>
		);
	}
}
