import React, { Fragment, useEffect, useState } from 'react'
import Styles from './LoginCard.module.css'
import BaseInput from '../../BaseInputNew/BaseInput'
import BaseButton from '../../BaseButton/BaseButton'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserByTokenAction, login } from '../../../redux/actions/userActions'
import { getAllEnabledSalonListAction } from '../../../redux/actions/salonActions'
import Spinner from '../../Spinner/Spinner'
import LoginSkeleton from '../../Skeletons/LoginSkeleton'


const LoginCard = () => {

  const history = useHistory();
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
    [userInfo, error, dispatch, setPassword, history]
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
  }

  return (
    <div className={Styles.loginCard}>
      <div className={Styles.bookbLogo}>
        <img src='../../assets/favicon.png' alt="" className={Styles.bookb_logo} />
      </div>
      <>
        <span className={Styles.signIn_text}>Sign in</span>
        <span className={Styles.credential_text}>Enter your credential to log into your account.</span>
        {loading ? (
          <LoginSkeleton />
        ) : (<Fragment>
          <div>
            <div className={Styles.baseInput1}>
              <BaseInput
                name={'username'}
                type={'text'}
                className={Styles.baseInput}
                title={'Email'}
                icon={'icon-new-email'}
                placeholder={'Enter the email'}
                value={email.value}
                onChange={(e) => setEmail({ value: e.target.value })}
                style={{background: 'none'}}
                errorMessage={email.error}
              />
            </div>
            <div className={Styles.baseInput1}>
              <BaseInput
                name="password"
                style={{background: 'none'}}
                className={Styles.baseInput}
                title={'Password'}
                icon={'icon-new-key'}
                type={'password'}
                placeholder={'Enter the password'}
                value={password.value}
                onChange={(e) => setPassword({ value: e.target.value })}
                errorMessage={password.error}
              />
            </div>
          </div>
          <div className={Styles.account_register} >
            <span style={{ marginRight: '.3rem', color: 'white' }} >Don't have an account ? </span>
            <Link to='register' className={Styles.onlick_register}>REGISTER</Link>
          </div>
          <div className={Styles.baseButton}>
            {loading && <Spinner />}
            <BaseButton
              title={'Login'}
              style={{background: '#ff9000'}}
              onClick={handleSubmit} />
          </div>
          <div className={Styles.copyright_section}>
            <span className={Styles.bookb}>&copy; {new Date(Date.now()).getFullYear()} BookB</span>
            <div className={Styles.powered_by}>
              <p>Proudly Powered By <a className={Styles.onlcik_the_algorithm} href='https://www.the-algo.com/' target='_blank'>The Algorithm</a></p>
            </div>
          </div>
        </Fragment>)}
      </>
    </div>
  )
}

export default LoginCard
