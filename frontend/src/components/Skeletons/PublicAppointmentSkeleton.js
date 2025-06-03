import React, { Fragment } from 'react';
import SkeletonStyles from './Skeletons.module.css';

const PublicAppointmentSkeleton = () => {
	return (
		<Fragment>
			<div style={{ marginTop: '1rem' }}>
				{/* <div className={[ SkeletonStyles.category, SkeletonStyles.skeleton ].join(' ')} /> */}
				<div style={{ marginTop: '2rem' }}>
					<div className={[ SkeletonStyles.service, SkeletonStyles.skeleton ].join(' ')} />
				</div>
				<div style={{ marginTop: '2rem' }} className={[ SkeletonStyles.appointmentSection ].join(' ')}>
					<div>
						{/* Styler profile */}
						<div className={[ SkeletonStyles.profile, SkeletonStyles.skeleton ].join(' ')} />
					</div>
					<div style={{ marginTop: '2rem' }}>
						{/* styler name */}
						<div className={[ SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton ].join(' ')} />
					</div>
					<div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
						{/* Time Slow */}

						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
					</div>

				</div>
				<div style={{ marginTop: '2rem' }} className={[ SkeletonStyles.appointmentSection ].join(' ')}>
					<div>
						{/* Styler profile */}
						<div className={[ SkeletonStyles.profile, SkeletonStyles.skeleton ].join(' ')} />
					</div>
					<div style={{ marginTop: '2rem' }}>
						{/* styler name */}
						<div className={[ SkeletonStyles.labelSkeleton, SkeletonStyles.skeleton ].join(' ')} />
					</div>
					<div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
						{/* Time Slow */}
						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
						<div className={[ SkeletonStyles.timeslot, SkeletonStyles.skeleton ].join(' ')} />
					</div>

				</div>
			</div>
		</Fragment>
	);
};

export default PublicAppointmentSkeleton;
