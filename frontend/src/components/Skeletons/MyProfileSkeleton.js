import React, { Fragment } from 'react'
import SkeletonStyles from './Skeletons.module.css'

const MyProfileSkeleton = () => {
    return (
        <> <div className={SkeletonStyles.container}>
            <div className={SkeletonStyles.content}>
                <div className={SkeletonStyles.userIconComponentSkeleton}>
                </div>
                <div className={SkeletonStyles.iconTextComponent}></div>
                <div className={SkeletonStyles.textInputSkeleton}>
                </div>
                <div className={SkeletonStyles.textAreaSkeleton}>
                </div>
                <div className={SkeletonStyles.textInputSkeleton}>
                </div>
                <div className={SkeletonStyles.textInputSkeleton}>
                </div>
                <div className={SkeletonStyles.textInputSkeleton}>
                </div>

                <div className={SkeletonStyles.buttonSkeleton}></div>
                <div className={SkeletonStyles.upadteButtonSkeleton}>
                </div>
            </div>
        </div>
        </>

    )
}

export default MyProfileSkeleton
