import React, { Fragment } from 'react';
import spinner from './spinner.gif';

const Spinner = () => {
	return (
		<Fragment>
			<img
				src={spinner}
				style={{
					width: '10rem',
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)'
				}}
				alt='Loading...'
			/>
		</Fragment>
	);
};

export default Spinner;
