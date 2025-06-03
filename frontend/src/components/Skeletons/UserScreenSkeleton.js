import React from 'react'
import SkeletonStyles from './Skeletons.module.css'

const UserScreenSkeleton = () => {
    return (
        <>
            <div className={SkeletonStyles.addUser}></div>
            <div className={SkeletonStyles.userContainer}>
                <div className={SkeletonStyles.userData}></div>
                <div className={SkeletonStyles.userData}></div>
                <div className={SkeletonStyles.userData}></div>
            </div>
        </>
    )
}

export default UserScreenSkeleton
