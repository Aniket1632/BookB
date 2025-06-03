import React, { Fragment, useEffect, useState } from 'react';
import Content from '../components/WebsiteContent/Content';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { inputPhoneMasking, unMasking, validateEmail, validatePhone } from '../../utils/validators';
import LoginSkeleton from '../../components/Skeletons/LoginSkeleton';
import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/formInputs/Button';
import InputsSections from '../../components/Modal/InputsSection1';
import ModalForm from '../../components/Modal/ModalForm';
import PublicAppointmentSkeleton from '../../components/Skeletons/PublicAppointmentSkeleton';
import SubHeadingContent from '../components/SubHeadingContent/SubHeadingContent';
import { forgotPasswordUserAction, getWebsiteSettingAction, getWebsiteSettingActionById, registerUserAction, webLogin } from '../../redux/actions/websiteSettingAction';
import { CHANGE_PASSWORD_USER_RESET, CREATE_NEW_USER_RESET } from '../../redux/constants/userConstants';
import { getUserByTokenAction } from '../../redux/actions/userActions';
import ChangePwdUser from './ChangePwdUser';
import InputBox from '../components/InputBox';
import { useParams } from 'react-router-dom';
import { GET_WEBSITE_SETTING_RESET } from '../../redux/constants/websiteSettingConstant';

const Login = ({ history }) => {
	const dispatch = useDispatch();
	const { salonId } = useParams();

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo, loading, error } = userLogin;

	const createUser = useSelector((state) => state.createUser);
	const changePasswordUser = useSelector((state) => state.changePasswordUser);

	const getPublicWebsite = useSelector((state) => state.getPublicWebsite);
	const [modalChangePasswordState, setModalChangePasswordState] = useState(false);

	const [email, setEmail] = useState({ value: '', error: '' });
	const [password, setPassword] = useState({ value: '', error: '' });


	const [name, setName] = useState({ value: '', error: '' });
	const [registerEmail, setRegisterEmail] = useState({ value: '', error: '' });
	const [registerPassword, setRegisterPassword] = useState({ value: '', error: '' });
	const [phone, setPhone] = useState({ value: '', error: '' });
	const [emailFPwd, setEmailFPwd] = useState({ value: '', error: '' });



	useEffect(() => {
		if (getPublicWebsite && !getPublicWebsite.websiteInfo) {
			dispatch(getWebsiteSettingActionById(salonId));
		}

		// return () => {
		// 	dispatch({ type: GET_WEBSITE_SETTING_RESET })
		// }
	}, [dispatch])


	useEffect(
		() => {
			dispatch(getUserByTokenAction());
			if (userInfo && userInfo.status) {
				clearData();
				history.push(`/salon/${getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.salon._id}#banner`)
			} else if (userInfo && !userInfo.status) {
				setPassword({ ...password, error: userInfo.message });
			}
		},
		[userInfo, error, dispatch]
	);


	useEffect(
		() => {
			if (createUser && createUser.userInfo && createUser.userInfo.status) {
				toast.success(createUser.userInfo.message);
				dispatch({ type: CREATE_NEW_USER_RESET });
				dispatch(webLogin(registerEmail.value, registerPassword.value));
			} else if (createUser && createUser.userInfo && !createUser.userInfo.status) {
				dispatch({ type: CREATE_NEW_USER_RESET });
				toast.error(createUser.userInfo.message);
			}
		},
		[createUser]
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


	const handleSubmit = (e) => {
		e.preventDefault();
		if (email.value === '' && email.value.trim() === '') {
			setEmail({ ...email, error: 'Please enter email address' });
		} else if (password.value === '' && password.value.trim() === '') {
			setPassword({ ...password, error: 'Please enter your password' });
		} else if (password.value.length < 7) {
			setPassword({ ...password, error: 'Password must be at least 8 characters' });
		} else {
			setEmail({ ...email, error: '' });
			setPassword({ ...password, error: '' });
			dispatch(webLogin(email.value, password.value));
		}
	};


	const registerUserHandler = (e) => {
		e.preventDefault();

		if (name.value === "") {
			setName({ error: "Please enter your Name" })
		} else if (registerEmail.value === "") {
			setRegisterEmail({ error: "Please enter your Email" })
		} else if (!validateEmail(registerEmail.value)) {
			setRegisterEmail({ error: "Invalid Email" })
		} else if (phone.value === "") {
			setPhone({ error: "Please enter your phone number." })
		} else if (!validatePhone(unMasking(phone.value))) {
			setPhone({ error: "Phone number must be of 10 digits." })
		} else if (registerPassword.value === "") {
			setRegisterPassword({ error: "Please select your gender" })
		}
		else {
			const formData = {
				name: name.value,
				email: registerEmail.value,
				phone: unMasking(phone.value),
				password: registerPassword.value
			}
			dispatch(registerUserAction(formData))
		}
	}

	const clearData = () => {
		setEmail({ value: '', error: '' });
		setPassword({ value: '', error: '' });
		setName({ value: '', error: '' });
		setRegisterEmail({ value: '', error: '' });
		setPhone({ value: '', error: '' });
		setRegisterPassword({ value: '', error: '' })
	}

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

	const onChangePwdModalClose = () => {
		setModalChangePasswordState(false);
	};


	return (
		<>
			<Content getPublicWebsite={getPublicWebsite}>
				<SubHeadingContent
					title={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarText}
					subTitle={getPublicWebsite && getPublicWebsite.websiteInfo && getPublicWebsite.websiteInfo.data && getPublicWebsite.websiteInfo.data.salon && getPublicWebsite.websiteInfo.data.appearanceBarPara}
				/>
				<div className="login-container">
					<div className="login-container-left">
						<div className='login-left-inside' >
							<div className='login-left-inside'>
								<h1 className='login_container__heading'>Sign in</h1>
								<h3 className='login_container__subheading'>Enter your credentials to log into your account.</h3>
							</div>
							{loading ? (
								<LoginSkeleton />
							) : (
								<Fragment>
									<InputBox
										type='email'
										placeholder='eg, johndoe@example.com'
										value={email.value}
										style={{ width: '100%', height: '5rem' }}
										onChange={(e) => setEmail({ value: e.target.value })}
										errorMessage={email.error}
										label='Email'
										icon='email'
									/>
									<InputBox
										type='password'
										placeholder='•••••••••••••'
										value={password.value}
										style={{ width: '100%', height: '5rem' }}
										onChange={(e) => setPassword({ value: e.target.value })}
										errorMessage={password.error}
										label='Password'
										icon='key'
									/>

									<button
										className="forgot-password"
										style={{
											width: '25rem',
											justifyContent: 'center'
										}}
										onClick={() => {
											setModalChangePasswordState(true)
										}}>
										Forgot Password
									</button>

									{loading && <Spinner />}
									<Button
										style={{
											width: '25rem',
											justifyContent: 'center'
										}}
										onClick={handleSubmit}
										label='Login'
										icon='arrow_right'
									/>

								</Fragment>
							)}
						</div>
					</div>
					<div className="login-container-right">
						<div className='login-left-inside' >
							<h1 className='login_container__heading'>Create Account</h1>
							<h3 className='login_container__subheading'>Enter your information to create your account.</h3>
							{loading ? (
								<PublicAppointmentSkeleton />
							) : (
								<ModalForm onSubmit={handleSubmit} style={{flexDirection: 'column', margin: '1rem -2rem' }}>
									<InputsSections style={{ width: '100%' }}>
										<InputBox
											label="User Name"
											icon="user"
											placeholder="eg, John Doe"
											value={name.value}
											style={{ width: '100%', height: '5rem', marginBottom:'2rem' }}
											onChange={(event) => {
												setName({ value: event.target.value, error: '' });
											}}
											errorMessage={name.error}
										/>
										<InputBox
											label="Email"
											icon="email"
											placeholder="eg, johndoe@example.com"
											style={{ width: '100%', height: '5rem', marginBottom:'2rem' }}
											value={registerEmail.value}
											onChange={(event) => {
												setRegisterEmail({ value: event.target.value, error: '' });
											}}
											errorMessage={registerEmail.error}
										/>
									</InputsSections>

									<InputsSections style={{ width: '100%' }}>
										<InputBox
											label="Phone"
											icon="phone"
											placeholder="eg, 123 456 7890"
											value={phone.value}
											style={{ width: '100%', height: '5rem', marginBottom:'2rem' }}
											onChange={(event) => {
												setPhone({ value: inputPhoneMasking(event.target.value), error: '' });
											}}
											errorMessage={phone.error}
										/>
										<InputBox
											type='password'
											placeholder='•••••••••••••'
											value={registerPassword.value}
											style={{ width: '100%', height: '5rem', marginBottom:'2rem' }}
											onChange={(e) => setRegisterPassword({ value: e.target.value })}
											errorMessage={registerPassword.error}
											label='Password'
											icon='key'
										/>
									</InputsSections>
									<InputsSections>
										{loading && <Spinner />}
										<Button
											style={{
												width: '25rem',
												justifyContent: 'center'
											}}
											onClick={registerUserHandler}
											label='Create Account'
											icon='arrow_right'
										/>
									</InputsSections>
								</ModalForm>
							)}
						</div>
					</div>
				</div>

				<ChangePwdUser data={{ modalChangePasswordState, onChangePwdModalClose, onChangePwdUserHandler, emailFPwd, setEmailFPwd }} />

			</Content>
		</>
	);
};

export default Login;
