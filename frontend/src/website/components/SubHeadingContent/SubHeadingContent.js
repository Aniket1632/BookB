import React from 'react';
import './SubHeadingContent.css';

const SubHeadingContent = ({ title, subTitle, style }) => {
	return (
		<div className="products_discount" style={style}>
			<h1 className="product_discount_heading">{title}</h1>
			<h1 className="product_discount_heading">{subTitle}</h1>
		</div>
	);
};

export default SubHeadingContent;
