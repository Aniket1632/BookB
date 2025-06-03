import React from 'react'
import LoginContent from '../../components/LoginContent/LoginContent';
import Styles from './LoginScreeenNew.module.css'

const loginScreenNew = () => {

    return (
        <div className={Styles.Container} >
            <div className={Styles.loginContainer}>
                <LoginContent />
            </div>
        </div>
    )
}

export default loginScreenNew;
