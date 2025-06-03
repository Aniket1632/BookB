import React from 'react';
import Styles from './PasswordChangeComponent.module.css';
import UserIconComponent from '../UserIconComponent/UserIconComponent';
import BaseInput from '../BaseInput/BaseInput';
import BaseButton from '../BaseButton/BaseButton';
import { useState } from 'react';
import { validatePassword } from '../../utils/validators';
import { useDispatch, useSelector } from 'react-redux';
import { updatePasswordUserAction, logout } from '../../redux/actions/userActions';
import { UPDATE_PASSWORD_USER_RESET } from '../../redux/constants/userConstants';

const PasswordChangeComponent = ({ setShowChangePassword, imageSrc, setImageSrc }) => {
  const dispatch = useDispatch();

  const [currentPassword, setCurrentPassword] = useState({ value: '', error: '' });
  const [newPassword, setNewPassword] = useState({ value: '', error: '' });
  const [retypePassword, setRetypePassword] = useState({ value: '', error: '' });

  const updatePasswordUser = useSelector(state => state.updatePasswordUser);

  React.useEffect(() => {
    if (updatePasswordUser && updatePasswordUser.userInfo && updatePasswordUser.userInfo.status) {
      dispatch({ type: UPDATE_PASSWORD_USER_RESET });
      dispatch(logout());
    }
  }, [updatePasswordUser, dispatch]);

  const handleSubmit = e => {
    e.preventDefault();

    if (currentPassword.value === '' && currentPassword.value.trim() === '') {
      setCurrentPassword(prevVal => ({ ...prevVal, error: 'Please enter your current password' }));
    } else if (!validatePassword(newPassword.value)) {
      setNewPassword(prevVal => ({ ...prevVal, error: 'Please enter strong password' }));
    } else if (newPassword.value !== retypePassword.value) {
      setRetypePassword(prevVal => ({ ...prevVal, error: 'Passwords do not match' }));
    } else {
      const formData = {
        password: newPassword.value,
        oldPassword: currentPassword.value,
      };

      dispatch(updatePasswordUserAction(formData));
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.content}>
        <UserIconComponent imageSrc={imageSrc} setImageSrc={setImageSrc} />
        <button className={Styles.edit_form} onClick={() => setShowChangePassword(false)}>
          <svg className={Styles.icon_edit}>
            <use xlinkHref={`/assets/sprite.svg#icon-back `}></use>
          </svg>
          <span className={Styles.edit_text}>Back</span>
        </button>
        <div className={Styles.baseInput}>
          <BaseInput
            errorStyle={{ marginBottom: '2rem' }}
            className={Styles.baseInput_input}
            title={'Current Password'}
            type={'password'}
            value={currentPassword.value}
            onChange={e => setCurrentPassword({ value: e.target.value, error: '' })}
            errorMessage={currentPassword.error}
          />
          <BaseInput
            errorStyle={{ marginBottom: '2rem' }}
            className={Styles.baseInput_input}
            title={'New Password'}
            type={'password'}
            value={newPassword.value}
            onChange={e => setNewPassword({ value: e.target.value, error: '' })}
            errorMessage={newPassword.error}
          />
          <BaseInput
            errorStyle={{ marginBottom: '2rem' }}
            className={Styles.baseInput_input}
            title={'Retype password'}
            type={'password'}
            value={retypePassword.value}
            onChange={e => setRetypePassword({ value: e.target.value, error: '' })}
            errorMessage={retypePassword.error}
          />
        </div>
        <div className={Styles.update_profile_button}>
          <BaseButton type={'Submit'} className={Styles.update_button} title={'Update'} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeComponent;
