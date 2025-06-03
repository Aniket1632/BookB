import React from 'react';
import fileUploadBox from './FileUpload.module.css';

const FileUpload = ({ onChange, className, errorMessage, label, icon, image }) => {
	return (
		<div style={{ margin: '2rem 0rem' }}>
			<div className='modalContainer__form--sections'>
				<div className={className ? className : fileUploadBox.form_input} >
					{/* {label && (
						<label htmlFor={label} className={fileUploadBox.form_input__label} style={{ marginBottom:'1rem' }}>
							{label}
						</label>
					)} */}
					<div className='btn-file'>
						{image ? (
							<img alt='image' src={image} className='fileUpload__label--image' />
						) : (
							<span className={fileUploadBox.fileUploadText}>
								<svg className='file_upload--icon'>
									<use xlinkHref={`/assets/sprite.svg#icon-${icon}`} />
								</svg>{' '}
								<br />
								{label}
							</span>
						)}
						<input type='file' name='uploadFiles' id='uploadFiles' accept='image/*' onChange={onChange} />
					</div>
				</div>
			</div>
			{errorMessage && <p className={fileUploadBox.form_input__error}>{errorMessage}</p>}
		</div>
	);
};

export default FileUpload;
