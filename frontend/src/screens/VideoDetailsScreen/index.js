import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Content from '../../components/Content';
import Button from '../../components/formInputs/Button';
import Spinner from '../../components/Spinner/Spinner';

import { getOneVideoAction } from '../../redux/actions/videoActions';

import VideoDetailStyle from './VideoDetails.module.css';
import VideosStyle from '../VideosScreen/Videos.module.css';
import { GET_ONE_VIDEO_RESET } from '../../redux/constants/videoConstants';

const VideosDetailsScreen = ({ match }) => {
	const videoId = match.params.id;
	const dispatch = useDispatch();

	const getOneVideo = useSelector((state) => state.getOneVideo);

	useEffect(
		() => {
			dispatch(getOneVideoAction(videoId));

			return () => {
				dispatch({ type: GET_ONE_VIDEO_RESET });
			};
		},
		[videoId, dispatch]
	);

	return (
		<Content currentMenu='videos' headerTitle='Lorem Ispum Video'>
			{getOneVideo && getOneVideo.loading ? (
				<Spinner />
			) : (
				getOneVideo &&
				getOneVideo.video &&
				getOneVideo.video.data &&
				getOneVideo.video.data.result && (
					<div className={VideoDetailStyle.videoDetails}>
						<div className={VideoDetailStyle.videoDetailsSection}>
							<div className={VideosStyle.videoCardStats}>
								<p className={VideosStyle.videoCardCategory}>
									{getOneVideo.video.data.result.videoCategory.categoryName}
								</p>
								<div className={VideosStyle.videoCardStatsCount}>
									<div className={VideosStyle.videoCardStat}>
										<svg className={VideosStyle.videoCardStatIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-favorite`} />
										</svg>
										<p>{getOneVideo.video.data.result.likeCount}</p>
									</div>
									<div className={VideosStyle.videoCardStat}>
										<svg className={VideosStyle.videoCardStatIcon}>
											<use xlinkHref={`/assets/sprite.svg#icon-visibility`} />
										</svg>
										<p>{getOneVideo.video.data.result.viewCount}</p>
									</div>
								</div>
							</div>
							<h4 className={VideoDetailStyle.videoDetails__subTitle}>
								{getOneVideo.video.data.result.videoDescription}
							</h4>
							{/* <Button label='Edit Video' icon='edit' /> */}
						</div>
						<div className={VideoDetailStyle.videoDetailsSection}>
							<video width='600' height='400' controls>
								<source src={getOneVideo.video.data.result.videoUrl} type='video/mp4' />
								Your browser does not support the video tag.
							</video>
						</div>
					</div>
				)
			)}
		</Content>
	);
};

export default VideosDetailsScreen;
