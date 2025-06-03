import React, { Fragment } from 'react';
import InputSections from '../../Modal/InputsSectionColumn';

import SkeletonStyles from '../Skeletons.module.css';

const HomeScreenSkeleton = () => {
	return (
		<Fragment>
			<div className='flex' style={{ alignItems: 'flex-start' }}>
				<InputSections>
					<div className='flex'>
						<div>
							<div className={[SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton].join(' ')} />
							<div className={[SkeletonStyles.textBoxSkeleton2, SkeletonStyles.skeleton].join(' ')} />
						</div>
						<div>
							<div className={[SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton].join(' ')} />
							<div className={[SkeletonStyles.textBoxSkeleton2, SkeletonStyles.skeleton].join(' ')} />
						</div>
					</div>
					<div>
						<div className={[SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton].join(' ')} />
						<div className={[SkeletonStyles.textBoxSkeleton2, SkeletonStyles.skeleton].join(' ')} />
					</div>
				</InputSections>
				<div className={[SkeletonStyles.uploadImageSkeleton2, SkeletonStyles.skeleton].join(' ')} />
			</div>
			<div className={[SkeletonStyles.buttonSkeleton2, SkeletonStyles.skeleton].join(' ')} />
		</Fragment>
	);
};

export default HomeScreenSkeleton;
