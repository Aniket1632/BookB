import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import ModalHeading from '../../components/Modal/ModalHeading';
import ModalForm from '../../components/Modal/ModalForm';
import InputsSection from '../../components/Modal/InputsSection';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import InputBox from '../../components/formInputs/InputBox';
import ModalButton from '../../components/Modal/ModalButton';
import { validatePassword } from '../../utils/validators';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordUserAction, getUserByTokenAction } from '../../redux/actions/userActions';
import { CHANGE_PASSWORD_USER_RESET } from '../../redux/constants/userConstants';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ChangePassword = ({ data }) => {
	const {
		selectUpdateModel,
		setSelectUpdateModel,
		modalChangePasswordState,
		setModalChangePasswordState,
	} = data;

	const dispatch = useDispatch();
	const userData = useSelector((state) => state.getUserInfo);
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');
	const changePasswordUser = useSelector((state) => state.changePasswordUser);


	useEffect(
		() => {
			if (changePasswordUser && changePasswordUser.userInfo && changePasswordUser.userInfo.status) {
				toast.success(changePasswordUser.userInfo.message);
				clearData();
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			} else if (changePasswordUser && changePasswordUser.userInfo && !changePasswordUser.userInfo.status) {
				toast.error(changePasswordUser.userInfo.message);
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			}
		},
		[changePasswordUser, dispatch]
	);


	const onChangePwdUserHandler = (e) => {
		e.preventDefault();
		if (password === '') {
			setPasswordError('Please enter password');
		} else if (password.length < 7) {
			setPasswordError('Password must be at least 8 characters');
		} if (!validatePassword(password)) {
			setPasswordError('Please enter valid password');
		} else if (password !== confirmPassword) {
			setConfirmPasswordError('Confirm password mismatch');
		} else {
			if (userData && userData.userInfo && userData.userInfo.data && userData.userInfo.data._id == selectUpdateModel._id) {
				let type = "bySelf";
				dispatch(changePasswordUserAction({ type, password }));
			} else {
				let type = 'byAdmin';
				dispatch(changePasswordUserAction({ 'id': selectUpdateModel._id, type, 'email': selectUpdateModel.email }));
			}
		}
	};


	const clearData = () => {
		setPassword('');
		setConfirmPassword('');
		setPasswordError('');
		setConfirmPassword('');
		setConfirmPasswordError('');
		setSelectUpdateModel({});
		setModalChangePasswordState(false);
	}


	return (
		<Modal show={modalChangePasswordState}>
			<ModalHeading heading='Change Password' onClose={clearData} />
			<ModalForm onSubmit={onChangePwdUserHandler} style={{ marginBottom: '2.5rem' }}>
				<InputsSection>
					<div className='flex' style={{ gap: '2rem' }}>
						<InputBox
							label='Password'
							icon='key'
							placeholder='**********'
							type='password'
							style={{ width: '40rem' }}
							value={password}
							onChange={(event) => {
								setPassword(event.target.value);
								setPasswordError('');
							}}
							errorMessage={passwordError}
						/>
					</div>
				</InputsSection>
				<InputsSectionColumn>
					<div className='flex' style={{ gap: '2rem' }}>
						<InputBox
							style={{ width: '40rem' }}
							label='Confirm Password'
							icon='key'
							placeholder='**********'
							type='password'
							value={confirmPassword}
							onChange={(event) => {
								setConfirmPassword(event.target.value);
								setConfirmPasswordError('');
							}}
							errorMessage={confirmPasswordError}
						/>
					</div>
				</InputsSectionColumn>

				<ModalButton label='Change Password' icon='edit' onClick={onChangePwdUserHandler} />

			</ModalForm>
		</Modal>
	);
};

export default ChangePassword;
