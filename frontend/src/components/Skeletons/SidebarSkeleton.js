import React from 'react';
import SkeletonStyles from './Skeletons.module.css';

const SidebarSkeleton = () => {
	const data = [ 10, 11, 13, 10, 8, 12, 7, 8 ];
	return (
		<div className={SkeletonStyles.SidebarSkeleton}>
			<div className={[ SkeletonStyles.navigation__logo_skeleton, SkeletonStyles.skeleton ].join(' ')} />
			{data &&
				data.map((d, i) => (
					<div
						key={i}
						className={[ SkeletonStyles.navigation__list, SkeletonStyles.skeleton ].join(' ')}
						style={{ width: `${d}rem` }}
					/>
				))}
		</div>
	);
};

export default SidebarSkeleton;
