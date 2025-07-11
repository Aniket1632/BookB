import React, { Fragment } from 'react';
import spinner from './spinner.gif';

const Spinner = () => {
	return (
		<Fragment>
			<img
				src={spinner}
				style={{
					width: '25px',
					height: '100%'
				}}
				alt='Loading...'
			/>
		</Fragment>
	);
};

export default Spinner;
