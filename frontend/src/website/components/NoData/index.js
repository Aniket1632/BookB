import React from 'react';
import NoDataStyles from './NoData.module.css';

const NoData = ({ icon = 'sad', title = 'No Data Found!', subTitle = 'We could not find any data.', height = '75vh' }) => {
	return (
		<div className={NoDataStyles.noDataContainer} style={{ height }}>
			<svg className={NoDataStyles.noDataContainerIcon}>
				<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
			</svg>
			<h3 className={NoDataStyles.noDataContainerText}>{title}</h3>
			<p className={NoDataStyles.noDataContainerSubText}>{subTitle}</p>
		</div>
	);
};

export default NoData;
