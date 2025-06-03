import React from 'react'
import Styles from './LoginContent.module.css'
import LoginCard from './LoginCard/LoginCard'

const LoginContent = () => {
    return (
        <div className={Styles.loginCotnent}>
            <div className={Styles.loginBox}>
                <LoginCard />
            </div>
        </div>
    )
}

export default LoginContent
