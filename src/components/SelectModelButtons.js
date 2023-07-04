import React, { Component } from 'react';

export default class SelectModelButtons extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedModelIndex: 0,
		};
	}

	onClickedSelectModel = () => {
		const models = Object.keys(this.props.modelsTable);
		const unpatedModelIndex =
			(this.state.selectedModelIndex + 1) % models.length;

		this.setState(
			{
				selectedModelIndex: unpatedModelIndex,
			},
			() => this.updateBack()
		);
	};

	updateBack = () => {
		const { modelsTable, setModel } = this.props;
		const selectedModel =
			Object.keys(modelsTable)[this.state.selectedModelIndex];
		setModel({
			selectedModel: selectedModel,
		});
	};

	render() {
		const { modelsTable, ...result } = this.props;
		return (
			<React.Fragment>
				<div className='col-4  text-center mb-3'>
					<span
						className='btn btn-dark btn-lg  position-relative badge start-0'
						onClick={this.onClickedSelectModel}
					>
						Select a model (click Load to commit)
						<span className='position-absolute top-0  start-50 translate-middle badge rounded-pill bg-danger'>
							{Object.keys(modelsTable)[this.state.selectedModelIndex]}
						</span>
						<span className='position-absolute top-0  start-100 translate-middle badge rounded-pill bg-danger'>
							{this.state.selectedModelIndex + 1}/
							{Object.keys(modelsTable).length}
						</span>
					</span>
				</div>
			</React.Fragment>
		);
	}
}
