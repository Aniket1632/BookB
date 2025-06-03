import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import Content from '../../components/Content';
import Spinner from '../../components/Spinner/Spinner';
import VideosStyle from './Videos.module.css';
import {
	changeVideoStatusAction,
	createVideoAction,
	deleteVideoAction,
	getAllVideosAction
} from '../../redux/actions/videoActions';
import CreateVideo from './CreateVideo';
import {
	CHANGE_VIDEO_STATUS_RESET,
	CREATE_VIDEO_RESET,
	DELETE_VIDEO_RESET,
	GET_ALL_VIDEOS_RESET
} from '../../redux/constants/videoConstants';
import DeleteVideo from './DeleteVideo';
import Pagination from '../../components/Pagination';

const VideosScreen = ({ history }) => {
	const dispatch = useDispatch();

	const [addModalActive, setAddModalActive] = useState(false);
	const [modalDeleteState, setModalDeleteState] = useState(false);
	const [search, setSearch] = useState('');

	const [videoTitle, setVideoTitle] = useState({ value: '', error: '' });
	const [videoDesc, setVideoDesc] = useState({ value: '', error: '' });
	const [videoCategory, setVideoCategory] = useState({ value: '', error: '' });
	const [videoStylist, setVideoStylist] = useState('');
	const [videoStylistError, setVideoStylistError] = useState('');

	// const [videoPoster, setVideoPoster] = useState({ image: '', error: '' });
	const [videoFile, setVideoFile] = useState({ video: '', error: '' });
	const [videoId, setVideoId] = useState({ video: '', error: '' });

	const getAllVideos = useSelector((state) => state.getAllVideos);
	const getUserInfo = useSelector((state) => state.getUserInfo);
	const createVideo = useSelector((state) => state.createVideo);
	const changeVideoStatus = useSelector((state) => state.changeVideoStatus);
	const deleteVideo = useSelector((state) => state.deleteVideo);


	const [totalPageSize, setTotalPageSize] = useState(1);
	const [pageNumber, setPageNumber] = useState(1);
	const pageLimit = 20;


	useEffect(
		() => {
			if (getUserInfo &&
				getUserInfo.userInfo &&
				getUserInfo.userInfo.data &&
				(getUserInfo.userInfo.data.role === 'salon' ||
					getUserInfo.userInfo.data.role === 'manager' ||
					getUserInfo.userInfo.data.role === 'stylist' ||
					getUserInfo.userInfo.data.role === 'superadmin')) {
				dispatch(getAllVideosAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				if (getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data.role === "stylist") {
					setVideoStylist(getUserInfo.userInfo.data._id);
				}
				return () => {
					dispatch({ type: GET_ALL_VIDEOS_RESET });
				};
			} else {
				history.push('/');
			}
		},
		[getUserInfo, dispatch]
	);



	useEffect(
		() => {
			if (createVideo && createVideo.video && createVideo.video.status) {
				toast.success(createVideo.video.message);
				dispatch(getAllVideosAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				handleAddModalClose();
				dispatch({ type: CREATE_VIDEO_RESET });
			} else if (createVideo && createVideo.video && !createVideo.video.status) {
				toast.error(createVideo.video.message);
				dispatch({ type: CREATE_VIDEO_RESET });
			}
		},
		[createVideo, dispatch]
	);

	useEffect(
		() => {
			if (changeVideoStatus && changeVideoStatus.video && changeVideoStatus.video.status) {
				toast.success(changeVideoStatus.video.message);
				dispatch(getAllVideosAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch({ type: CHANGE_VIDEO_STATUS_RESET });
			}
		},
		[changeVideoStatus, dispatch]
	);

	useEffect(
		() => {
			if (deleteVideo && deleteVideo.video && deleteVideo.video.status) {
				toast.success(deleteVideo.video.message);
				dispatch(getAllVideosAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: '' }));
				dispatch({ type: DELETE_VIDEO_RESET });
			}
		},
		[deleteVideo, dispatch]
	);

	const handleAddModalClose = () => {
		setAddModalActive(false);
		setVideoTitle({ value: '', error: '' });
		setVideoDesc({ value: '', error: '' });
		setVideoCategory({ value: '', error: '' });
		setVideoStylist({ value: '', error: '' });
		setVideoFile({ video: '', error: '' });
	};

	const handleUploadVideo = (e) => {
		e.preventDefault();
		if (!videoTitle.value || (videoTitle.value === '' && videoTitle.value.trim() === '')) {
			setVideoTitle({ ...videoTitle, error: 'Please enter video title' });
		} else if (!videoDesc.value || (videoDesc.value === '' && videoDesc.value.trim() === '')) {
			setVideoDesc({ ...videoDesc, error: 'Please enter video description' });
		} else if (!videoCategory.value || (videoCategory.value === '' && videoCategory.value.trim() === '')) {
			setVideoCategory({ ...videoCategory, error: 'Please enter video description' });
		} else if (videoStylist === '' && videoStylist.trim() === '') {
			setVideoStylistError('Please select video stylist');
		} else if (!videoFile.video || videoFile.video === '') {
			setVideoFile({ ...videoFile, error: 'Please select a video' });
		} else if (!videoFile.video && !videoFile.video.type.startsWith('video/')) {
			setVideoFile({ ...videoFile, error: 'Please select a valid video file' });
		} else {
			const uploadedBy = getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data.role;
			const salon = getUserInfo && getUserInfo.userInfo && getUserInfo.userInfo.data && getUserInfo.userInfo.data._id;
			let data = new FormData();
			data.append('videoTitle', videoTitle.value);
			data.append('videoDescription', videoDesc.value);
			data.append('videoCategory', videoCategory.value);
			data.append('uploadedBy', uploadedBy);
			data.append('salon', salon);
			data.append('stylist', videoStylist);
			data.append('video', videoFile.video);
			dispatch(createVideoAction(data));
		}
	};

	const handleEnableVideo = (id, enableStatus) => {
		dispatch(changeVideoStatusAction(id, enableStatus));
	};

	const onDeleteModalClose = () => {
		setModalDeleteState(false);
	};

	const onDeleteHandler = () => {
		dispatch(deleteVideoAction(videoId));
		onDeleteModalClose();
	};

	const onSearchHandler = (event) => {
		setSearch(event.target.value);
		if (search.trim !== '' && search.length > 0) {
			setPageNumber(1);
		}
		dispatch(getAllVideosAction({ pageNumber: pageNumber, pageSize: pageLimit, filter: event.target.value }));
	};

	const handlePageChange = async (currentPage) => {
		const selectedPage = currentPage.selected;
		dispatch(getAllVideosAction({ pageNumber: selectedPage + 1, pageSize: pageLimit, filter: '' }));
		setPageNumber(selectedPage + 1);
	};

	return (
		<Content
			currentMenu='videos'
			headerTitle='List of all video contents'
			addBtn={
				getUserInfo &&
					getUserInfo.userInfo &&
					getUserInfo.userInfo.data &&
					(getUserInfo.userInfo.data.role === 'salon' ||
						getUserInfo.userInfo.data.role === 'manager' ||
						getUserInfo.userInfo.data.role === 'superadmin' ||
						getUserInfo.userInfo.data.role === 'stylist'
					) ? true : false
			}
			addBtnText='Upload Video'
			addBtnIcon='upload'
			addBtnClick={() => setAddModalActive(true)}
			search={true}
			searchPlaceholder='Search Videos...'
			searchIcon='search'
			searchvalue={search}
			searchOnChange={onSearchHandler}
		>
			<div className={VideosStyle.videoCards}>
				{getAllVideos && getAllVideos.loading ? (
					<Spinner />
				) :
					getAllVideos &&
						getAllVideos.videos &&
						getAllVideos.videos.data &&
						getAllVideos.videos.data.result &&
						getAllVideos.videos.data.result.length > 0 ? (
						getAllVideos.videos.data.result.map((res) => (
							<div className={VideosStyle.videoCard} key={res._id}>
								<Link to={`videos/${res._id}`} className={VideosStyle.videoCard__iImageIcon}>
									<img src='/assets/login-bg.jpg' alt='video thumb' className={VideosStyle.videoCard__iImageIcon_image} />
									<div className={VideosStyle.videoCard__iImageIcon_icon_container}>
										<svg className={VideosStyle.videoCard__iImageIcon_icon}>
											<use xlinkHref={`/assets/sprite.svg#icon-play_arrow`} />
										</svg>
									</div>
								</Link>
								<Link to={`videos/${res._id}`} className={VideosStyle.videoCard__title}>
									{res.videoTitle}
								</Link>
								<h4 className={VideosStyle.videoCard__subTitle}>
									{res.videoDescription.length > 0 && res.videoDescription}
								</h4>

								<div className={VideosStyle.videoCardStats}>
									<p className={VideosStyle.videoCardCategory}>Shampoo </p>
									<div className={VideosStyle.videoCardStatsCount}>
										<div className={VideosStyle.videoCardStat}>
											<svg className={VideosStyle.videoCardStatIcon}>
												<use xlinkHref={`/assets/sprite.svg#icon-favorite`} />
											</svg>
											<p>{res.likeCount}</p>
										</div>
										<div className={VideosStyle.videoCardStat}>
											<svg className={VideosStyle.videoCardStatIcon}>
												<use xlinkHref={`/assets/sprite.svg#icon-visibility`} />
											</svg>
											<p>{res.viewCount}</p>
										</div>
									</div>
								</div>
								<div className={VideosStyle.videoCardActions}>
									<label className='switch'>
										<input
											checked={res.enable}
											onChange={() => {
												handleEnableVideo(res._id, res.enable);
											}}
											type='checkbox'
											className='checkbox'
											name='active'
										/>
										<span className='slider round' />
									</label>
									<div className={VideosStyle.videoCardActionBtn}>
										{/* <button className={VideosStyle.videoCardAction} >
											<svg className={VideosStyle.videoCardActionIcon}>
												<use xlinkHref={`/assets/sprite.svg#icon-edit`} />
											</svg>
										</button> 
										<button className={VideosStyle.videoCardAction} onClick={() => {
											setVideoId(res._id)
											setModalDeleteState(true)
										}}>
											<svg className={VideosStyle.videoCardActionIcon}>
												<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
											</svg>
										</button>*/}

										<button className='table__button table__button--delete' onClick={() => {
											setVideoId(res._id)
											setModalDeleteState(true)
										}}>
											<svg className='table__button--icon-red'>
												<use xlinkHref={`/assets/sprite.svg#icon-delete`} />
											</svg>
											<span>Delete Video</span>
										</button>
									</div>
								</div>
							</div>
						)))
						: (
							<div className='not_data_found'>
								<h1>No data found !</h1>
							</div>
						)}

				{totalPageSize > 1 &&
					<div className="tableContainer--paginater">
						<Pagination list={getAllVideos.videos} onPageChange={handlePageChange} rowsPerPage={pageLimit} totalPageSize={totalPageSize} pageNumber={pageNumber} />
					</div>}
			</div>

			<CreateVideo
				data={{
					addModalActive,
					handleAddModalClose,
					videoTitle,
					setVideoTitle,
					videoDesc,
					setVideoDesc,
					videoCategory,
					setVideoCategory,
					videoStylist,
					setVideoStylist,
					videoStylistError,
					setVideoStylistError,
					// videoPoster,
					// setVideoPoster,
					videoFile,
					setVideoFile,
					handleSubmit: handleUploadVideo
				}}
			/>

			<DeleteVideo data={{ modalDeleteState, onDeleteModalClose, onDeleteHandler }} />

		</Content>
	);
};

export default VideosScreen;
