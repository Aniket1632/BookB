import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({getEnabledCategory, data}) => {
	const {productFilter, setProductFilter} = data;

	const toggle_viewCart = () => {
		let navigation = document.querySelector('.single-category');
		navigation.classList.toggle('open');

		let icon_down = document.querySelector('.arrow-cont-down');
		icon_down.classList.toggle('icon-close-down');
		let icon_up = document.querySelector('.arrow-cont-up');
		icon_up.classList.toggle('icon-close-up');
	};

	return (
		<div className="sidebar">
			<div className="sidebar_filter" onClick={toggle_viewCart}>
				<p>Filter</p>
				<div className="icon--filter">
					<svg className="arrow-cont-down icon-close-down">
						<use xlinkHref="assets/sprite.svg#icon-circle-down" />
					</svg>
					<svg className="arrow-cont-up icon-close-up">
						<use xlinkHref="assets/sprite.svg#icon-circle-up" />
					</svg>
				</div>
			</div>
			<div className='single-category open'>
				<h1 className="sidebar_heading">Product Categories</h1>
				<div action="" className="sidebar_form1">
					<div className='filter--content'>
						<input type="radio" id="select" name="select"
						defaultChecked
						value = ''
						onChange={(e)=> setProductFilter(e.target.value) }/>
						<p>All</p>
					</div>
					{getEnabledCategory && getEnabledCategory.categories && getEnabledCategory.categories.data.map((item)=>
					<div className='filter--content'>
						<input
						type="radio" id="select" name="select"
						 value={productFilter}
						//  checked = {toggleSwitch1}
						 onChange={(e)=> {
							setProductFilter(item.categoryName)
							 }}
						  />
						<p>{item.categoryName}</p>
					</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
