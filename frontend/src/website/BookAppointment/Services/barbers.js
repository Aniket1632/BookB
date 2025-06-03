import React from 'react';

const Barbers = ({ img, type, label, TextBox, icon }) => {
	return <div className="barbers" img={img} type={type ? type : 'text'} label={label} />;
};

export default Barbers;
