import React, { Fragment, useState, useEffect } from 'react';
import fileUploadBox from '../formInputs/FileUpload/FileUpload.module.css';

const UploadFile = ({ label, accept, icon, onChange, image, errorMessage }) => {
	const [uploadData, setUploadData] = useState([]);
	const [uploadVideoName, setUploadVideoName] = useState('');
	const [imageSrc, setImageSrc] = useState(image);

	useEffect(
		() => {
			if (accept && accept.startsWith('image') && uploadData.length > 0) {
				handleChangeImage();
			} else if (accept && accept.startsWith('video') && uploadData.length > 0) {
				setUploadVideoName(uploadData[0].name);
			}
		},
		[accept, uploadData, handleChangeImage]
	);

	const handleChangeImage = () => {
		var file = uploadData[0];
		var reader = new FileReader();
		if (uploadData[0]) {
			var url = reader.readAsDataURL(file);
			reader.onloadend = () => {
				setImageSrc(reader.result);
			};
		}
	};

	return (
		<div className='fileUpload'>
			<input
				type='file'
				id={label}
				accept={accept}
				onChange={(e) => {
					onChange(e);
					setUploadData(e.target.files);
				}}
				hidden
			/>
			<label htmlFor={label} className='fileUpload__label'>
				{accept && accept.startsWith('image') ? uploadData && uploadData.length > 0 ? (
					<img src={imageSrc} alt='upload file' className='fileUpload__label--image' />
				) : (
					<Fragment>
						<svg className='fileUpload__label--icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
						</svg>
						<span>{label}</span>
					</Fragment>
				) : uploadData && uploadData.length > 0 ? (
					<span style={{ width: '20rem', overflow: 'auto' }}>{uploadVideoName}</span>
				) : (
					<Fragment>
						<svg className='fileUpload__label--icon'>
							<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
						</svg>
						<span>{label}</span>
					</Fragment>
				)}
			</label>
			{errorMessage && <p className={fileUploadBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default UploadFile;
