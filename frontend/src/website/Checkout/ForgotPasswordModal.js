import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import Modal from '../../components/Modal'
import ModalButton from '../../components/Modal/ModalButton'
import ModalForm from '../../components/Modal/ModalForm'
import ModalHeading from '../../components/Modal/ModalHeading'
import { getUserByTokenAction } from '../../redux/actions/userActions'
import { forgotPasswordUserAction } from '../../redux/actions/websiteSettingAction'
import { CHANGE_PASSWORD_USER_RESET } from '../../redux/constants/userConstants'
import { validateEmail } from '../../utils/validators'
import InputBox from '../components/InputBox'

const ForgotPasswordModal = ({ data }) => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { modalChangePasswordState, onChangePwdModalClose } = data;
	const [emailFPwd, setEmailFPwd] = useState({ value: '', error: '' });

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo, loading, error } = userLogin;
	const changePasswordUser = useSelector((state) => state.changePasswordUser);

	useEffect(
		() => {
			dispatch(getUserByTokenAction());
			if (userInfo && userInfo.status) {
				setEmailFPwd({ value: '', error: '' });
				// history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon.name}/checkout`)
			} else if (userInfo && !userInfo.status) {
				setEmailFPwd({ ...emailFPwd, error: userInfo.message });
			}
		},
		[userInfo, error, dispatch]
	);

	useEffect(
		() => {
			if (changePasswordUser && changePasswordUser.userInfo && changePasswordUser.userInfo.status) {
				toast.success(changePasswordUser.userInfo.message);
				onChangePwdModalClose();
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			} else if (changePasswordUser && changePasswordUser.userInfo && !changePasswordUser.userInfo.status) {
				toast.error(changePasswordUser.userInfo.message);
				dispatch({ type: CHANGE_PASSWORD_USER_RESET });
			}
		},
		// eslint-disable-next-line
		[changePasswordUser, dispatch]
	);

	const onChangePwdUserHandler = (e) => {
		e.preventDefault()
		if (emailFPwd.value === "") {
			setEmailFPwd({ error: "Please enter your Email" })
		} else if (!validateEmail(emailFPwd.value)) {
			setEmailFPwd({ error: "Invalid Email" })
		} else {
			dispatch(forgotPasswordUserAction({ email: emailFPwd.value }));
		}
	};

	return (
		<Modal show={modalChangePasswordState} style={{ background: '#ffffff' }}>
			<ModalHeading heading='Password assistance' onClose={onChangePwdModalClose} />
			<ModalForm>
				<p className='modal__text' style={{ marginBottom: '0' }}>
					Enter the email address associated with your salon account.{' '}
				</p>
				<br />
				<InputBox
					type='email'
					placeholder='eg, johndoe@example.com'
					value={emailFPwd.value}
					style={{ width: '100%', height: '5rem' }}
					onChange={(e) => setEmailFPwd({ value: e.target.value })}
					errorMessage={emailFPwd.error}
					label=''
					icon='email'
				/>
				<br />
				<p className='modal__text2'>We'll send the auto genrated password to user email address.</p>
				<ModalButton varient='danger' label='Reset Password' icon='key' onClick={onChangePwdUserHandler} />
			</ModalForm>
		</Modal>
	)
}

export default ForgotPasswordModal