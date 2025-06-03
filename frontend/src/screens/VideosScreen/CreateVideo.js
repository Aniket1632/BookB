import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputSections from '../../components/Modal/InputSections';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import SelectBox from '../../components/formInputs/SelectBox';
import UploadFile from '../../components/Modal/UploadFile';
import { getAllVideoCategoriesAction } from '../../redux/actions/videoActions';
import { getStylistListAction } from '../../redux/actions/stylistActions';
import TextareaBox from '../../components/formInputs/TextareaBox';

const CreateVideo = ({ data }) => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.getUserInfo);
	const getAllVideoCategories = useSelector((state) => state.getAllVideoCategories);
	const stylistList = useSelector((state) => state.stylistList);

	const {
		addModalActive,
		handleAddModalClose,
		handleSubmit,

		videoTitle,
		setVideoTitle,
		videoDesc,
		setVideoDesc,
		videoCategory,
		setVideoCategory,
		videoStylist,
		setVideoStylist,
		videoFile,
		setVideoFile,

		videoStylistError,
		setVideoStylistError,
		// videoPoster,
		// setVideoPoster,
	} = data;


	useEffect(
		() => {
			dispatch(getAllVideoCategoriesAction({ pageNumber: 1, pageSize: 1000, filter: '' }));
			dispatch(getStylistListAction({ pageNumber: 1, pageSize: 1000, filter: '' }));

			// return () => {
			// 	dispatch({ type: GET_ALL_VIDEO_CATEGORY_RESET });
			// };
		},
		[dispatch]
	);

	return (
		<Modal show={addModalActive}>
			<ModalHeading heading='Upload New Video' onClose={handleAddModalClose} />

			<ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<InputBox
						label='Video Title'
						icon='film'
						placeholder='eg, Shampoo  '
						value={videoTitle.value}
						onChange={(e) => setVideoTitle({ value: e.target.value, error: '' })}
						errorMessage={videoTitle.error}
					/>
					<TextareaBox
						label='Video Description'
						icon='film'
						placeholder='eg, Video description'
						value={videoDesc.value}
						onChange={(e) => setVideoDesc({ value: e.target.value, error: '' })}
						errorMessage={videoDesc.error}
					/>
				</InputsSection>
				<InputsSection>
					<SelectBox
						value={videoCategory.value}
						onChange={(e) => setVideoCategory({ value: e.target.value, error: '' })}
						label='Video Category'
						icon='archive'
						name='video-category'
						errorMessage={videoCategory.error}
					>
						<option className='optionBox' value=''>
							Select Category
						</option>
						{getAllVideoCategories &&
							getAllVideoCategories.categories &&
							getAllVideoCategories.categories.data &&
							getAllVideoCategories.categories.data.result &&
							getAllVideoCategories.categories.data.result.map((res) => (
								<option value={res._id} key={res._id}>
									{res.categoryName}
								</option>
							))}
					</SelectBox>

					{
						userData &&
						userData.userInfo &&
						userData.userInfo.status &&
						userData.userInfo.data &&
						userData.userInfo.data.role !== 'stylist' &&
						<SelectBox
							value={videoStylist}
							onChange={(e) => {
								setVideoStylist(e.target.value);
								setVideoStylistError('');
							}}
							label='Stylist Name'
							icon='stylist'
							name='stylist-name'
							errorMessage={videoStylistError}
						>
							<option className='optionBox' value=''>
								Select Stylist
							</option>
							{stylistList &&
								stylistList.userInfo &&
								stylistList.userInfo.status &&
								stylistList.userInfo.data.result.length > 0 ? (
								stylistList.userInfo.data.result.map((res) => (
									<option value={res._id} key={res._id}>
										{res.name}
									</option>
								))
							) : (
								<option value=''>No stylist found</option>
							)}
						</SelectBox>
					}

				</InputsSection>
				<InputSections>
					{/* <InputsSection>
						<UploadFile
							label='Upload Video Poster'
							icon='upload'
							accept='image/*'
							onChange={(e) => {
								e.target.files.length > 0 && setVideoPoster({ image: e.target.files[0] });
							}}
							errorMessage={videoPoster.error}
						/>
					</InputsSection> */}
					<InputsSection>
						<UploadFile
							label='Upload Video'
							icon='upload'
							accept='video/*'
							onChange={(e) => {
								e.target.files.length > 0 && setVideoFile({ video: e.target.files[0], error: '' });
							}}
							errorMessage={videoFile.error}
						/>
					</InputsSection>
				</InputSections>

				<ModalButton label={'Add New'} icon={'plus'} onClick={handleSubmit} />
			</ModalForm>
		</Modal>
	);
};

export default CreateVideo;
