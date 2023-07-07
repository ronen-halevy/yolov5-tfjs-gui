import React from 'react';
import Readme from './Readme';

class Accordion extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='accordion' id='accordionPanelsStayOpenExample'>
				<div className='accordion-item'>
					<h2 className='accordion-header' id='panelsStayOpen-headingOne'>
						<button
							className='accordion-button collapsed'
							type='button'
							data-bs-toggle='collapse'
							data-bs-target='#panelsStayOpen-collapseOne'
							aria-expanded='false'
							aria-controls='panelsStayOpen-collapseOne'
						>
							<span class='border border-dark '>Readme</span>
						</button>
					</h2>
					<div
						id='panelsStayOpen-collapseOne'
						className='accordion-collapse collapse'
						aria-labelledby='panelsStayOpen-headingOne'
					>
						<div className='accordion-body'>
							<Readme />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Accordion;
