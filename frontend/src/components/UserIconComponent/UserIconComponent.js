import React, { useState, useEffect } from 'react';
import Styles from './UserIconComponent.module.css';
import ImageUploadComponent from '../ImageUploadComponent/ImageUploadComponent';
import { useSelector } from 'react-redux';

const UserIconComponent = ({ imageSrc, setImageSrc, previewURL, setPreviewURL }) => {
  const [uploadFileData, setUploadFileData] = useState({ data: '', error: '' });
  const [loading, setLoading] = useState(false);

  const myProfileDetails = useSelector((state) => state.myProfileDetails);

  const handleChangeImage = (e) => {
    var file = e.target.files[0];
    setImageSrc(file)
    var reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
    }
  };

  return (
    <div className={Styles.edit_profile}>
      <div className={Styles.icon_my_profile}>
        <ImageUploadComponent
          label="Upload Image"
          icon="upload"
          image={previewURL}
          onChange={(e) => {
            handleChangeImage(e);
            setUploadFileData((prevData) => ({ ...prevData, data: e.target.files, error: '' }));
          }}
          errorMessage={uploadFileData.error}
          style={{ padding: '.5rem 1.5rem', paddingBottom: '1.5rem' }}
        />
      </div>
    </div>
  );
};

export default UserIconComponent;
