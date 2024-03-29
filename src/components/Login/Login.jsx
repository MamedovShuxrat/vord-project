import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../Registration/registration.module.scss'

import SimpleInput from '../Inputs/SimpleInput'
import AuthPasswordInput from '../Inputs/AuthPasswordInput'
import Button from '../Button/Button'

const Login = () => {
    return (
        <div className={styles.register}>
            <div className={styles.register__title_wrapper}>
                <h2 className={styles.register__title}>Log in to VARD  </h2>
                <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
            </div>
            <SimpleInput placeholder='Email' className="loginInput" />
            <AuthPasswordInput placeholder='Password' />
            <Button className={styles.main} >Log in</Button>
            <span className={styles.login__or}>or</span>
            <Link to='/register'>
                <Button className={styles.secondary} >Create account</Button>
            </Link>
        </div>

    )
}

export default Login