import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '../../components/formInputs/Button';
import InputBox from '../../components/formInputs/InputBox';
import Spinner from '../../components/Spinner/Spinner';
import { getAllEnabledSalonListAction } from '../../redux/actions/salonActions';
import { getUserByTokenAction, login, logout } from '../../redux/actions/userActions';
import './LoginScreen.css';
import LoginSkeleton from '../../components/Skeletons/LoginSkeleton';

const LoginScreen = ({ history }) => {
	const dispatch = useDispatch();
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo, loading, error } = userLogin;

	const userData = useSelector((state) => state.getUserInfo);

	const [email, setEmail] = useState({ value: '', error: '' });
	const [password, setPassword] = useState({ value: '', error: '' });


	useEffect(
		() => {
			dispatch(getUserByTokenAction());
			dispatch(getAllEnabledSalonListAction());
			if (userInfo && userInfo.status) {
				history.push('/');
			} else if (userInfo && !userInfo.status) {
				setPassword({ ...password, error: userInfo.message });
			}
		},
		[userInfo, error, dispatch]
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
			dispatch(login(email.value, password.value));
		}
	};
	return (
		<div className='container'>
			<div
				className='login_container'
			>
				<div className='login_container_side_image' style={{ backgroundImage: "url('./assets/39084.png')" }}>
				</div>


				<div className='login_container__form' >
					<img src='./assets/logo.png' alt='BookB Logo' className='login_container__logo' />
					<div>
						<h1 className='login_container__heading'>Sign in</h1>
						<h3 className='login_container__subheading'>Enter your credentials to log into your account.</h3>
					</div>
					{loading ? (
						<LoginSkeleton />
					) : (
						<Fragment>
							<InputBox
								style={{ width: '25rem' }}
								type='email'
								placeholder='eg, johndoe@example.com'
								value={email.value}
								onChange={(e) => setEmail({ value: e.target.value })}
								errorMessage={email.error}
								label='Email'
								icon='email'
							/>
							<InputBox
								type='password'
								placeholder='•••••••••••••'
								value={password.value}
								onChange={(e) => setPassword({ value: e.target.value })}
								errorMessage={password.error}
								label='Password'
								icon='key'
							/>
							{loading && <Spinner />}
							<Button style={{
								width: '25rem',
								justifyContent: 'center'
							}} onClick={handleSubmit} label='Login' icon='arrow_right' />

							<div className='login__register'>
								<p className='login__copyright-text'>Don't have an account? </p>
								<Link to='register' className='login-register'>Register</Link>
							</div>

							<div className='login__copyright'>
								<p className='login__copyright-text'>&copy; {new Date(Date.now()).getFullYear()} BookB</p>
								<p className='login__copyright-text'>
									Proudly Powered By{' '}
									<a href='https://www.the-algo.com/' target='_blank'>
										The Algorithm
									</a>
								</p>
							</div>
						</Fragment>
					)}
				</div>
			</div>
		</div>
	);
};

export default LoginScreen;
