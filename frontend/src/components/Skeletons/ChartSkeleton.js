import React from 'react';
import SkeletonStyles from './Skeletons.module.css';

const ChartSkeleton = () => {
	return <div className={[ SkeletonStyles.chartSkeleton, SkeletonStyles.skeleton ].join(' ')} />;
};

export default ChartSkeleton;
