import React from 'react';
import ImageUploadBox from './ImageUploadComponent.module.css';
import Styles from '../UserIconComponent/UserIconComponent.module.css';

const ImageUploadComponent = ({ onChange, errorMessage, label, icon, image }) => {
  return (
    <div>
      <div>
        <div className={ImageUploadBox.form_input}>
          {/* {label && (
						<label htmlFor={label} className={fileUploadBox.form_input__label} style={{ marginBottom:'1rem' }}>
							{label}
						</label>
					)} */}
          <div className={ImageUploadBox.btn_file}>
            {image ? (
              <img alt='image' src={image} className={ImageUploadBox.fileUpload__label_image} />
            ) : (
              <span className={ImageUploadBox.fileUploadText}>
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
        <label htmlFor='uploadFiles' className={Styles.edit_form}>
          <svg className={Styles.icon_edit}>
            <use xlinkHref={`/assets/sprite.svg#icon-edit`}></use>
          </svg>
          <span className={Styles.edit_text}>Edit profile photo</span>
        </label>
      </div>
      {errorMessage && <p className={ImageUploadBox.form_input__error}>{errorMessage}</p>}
    </div>
  );
};

export default ImageUploadComponent;
