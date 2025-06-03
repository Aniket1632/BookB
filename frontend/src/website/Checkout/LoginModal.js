import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '../../components/formInputs/Button';
import Modal from '../../components/Modal';
import InputsSectionColumn from '../../components/Modal/InputsSectionColumn';
import ModalForm from '../../components/Modal/ModalForm';
import ModalHeading from '../../components/Modal/ModalHeading';
import { getUserByTokenAction } from '../../redux/actions/userActions';
import { webLogin } from '../../redux/actions/websiteSettingAction';
import InputBox from '../components/InputBox';

const LoginModal = ({ data }) => {
    const { handleLoginModalClose, loginModal, setModalChangePasswordState, setModalCreateAccount } = data;

    const dispatch = useDispatch();
    const history = useHistory();
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo, loading, error } = userLogin;

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

    const clearData = () => {
        setEmail({ value: '', error: '' });
        setPassword({ value: '', error: '' });
    }

    useEffect(
        () => {
            dispatch(getUserByTokenAction());
            if (userInfo && userInfo.status) {
                handleLoginModalClose();
                clearData();
            } else if (userInfo && !userInfo.status) {
                setPassword({ ...password, error: userInfo.message });
            }
        },
        [userInfo, error, dispatch]
    );

    return (
        <Modal show={loginModal}>
            <ModalHeading onClose={handleLoginModalClose} />
            <ModalForm onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
                <div className='login-left-inside' style={{ width: '100%', alignItems: 'center', gap: '1rem' }}>
                    <h1 className='login_container__heading'>Sign in</h1>
                    <h3 className='login_container__subheading'>Enter your credentials to log into your account.</h3>
                </div>
                <InputsSectionColumn style={{ flexDirection: 'column' }}>
                    <InputBox
                        type='text'
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

                </InputsSectionColumn>
                <InputsSectionColumn style={{ backgroundColor: 'var(--light-grey1)', margin: '0' }}>
                    <button
                        className="forgot-password"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            textAlign: 'left'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setModalCreateAccount(true)
                        }}
                    >
                        Create Account
                    </button>
                    <button
                        className="forgot-password"
                        style={{
                            width: '100%',
                            justifyContent: 'flex-end',
                            color: 'red',
                            textAlign: 'right'
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setModalChangePasswordState(true)
                        }}
                    >
                        Forgot Password
                    </button>
                </InputsSectionColumn>

                {/* {loading && <Spinner />} */}
                <Button
                    style={{
                        width: '100%',
                        justifyContent: 'center'
                    }}
                    onClick={handleSubmit}
                    label='Login'
                    icon='arrow_right'
                />
            </ModalForm>
        </Modal>
    )
}

export default LoginModal