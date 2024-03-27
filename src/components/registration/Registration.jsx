import React from 'react'
import { Link } from 'react-router-dom'
import styles from './registration.module.scss'
import Button from '../Button/Button'
import SimpleInput from '../Inputs/SimpleInput'
import AuthPasswordInput from '../Inputs/AuthPasswordInput'

const Registration = () => {
    return (
        <div className={styles.register}>
            <div className={styles.register__title_wrapper}>
                <div className={styles.wrapper}>
                    <h2 className={styles.register__title}>Welcome to VARD  </h2>
                    <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
                </div>
            </div>
            <form action="/get">
                <SimpleInput placeholder='Name' className="loginInput" />
                <SimpleInput placeholder='Email' className="loginInput" />
                <AuthPasswordInput placeholder='Password' />
                <AuthPasswordInput placeholder='Confirm password' />
                <div className={styles.login__privacy}>
                    <input type="checkbox" className={styles.login__checkbox} required />
                    <span className={styles.login__privacy_text}>I agree with</span>
                    <a href="https://vard.tech/service" target="_blank" className={styles.login__privacy_link}>Terms of service</a>
                    <span className={styles.login__privacy_text}>and</span>
                    <a href="https://vard.tech/policy" target="_blank" className={styles.login__privacy_link}>Privacy policy</a>
                </div>
                <Button className={styles.main} >Create account</Button>
                <span className={styles.login__or}>or</span>
                <Link to='/login'>
                    <Button className={styles.secondary} >Log in</Button>
                </Link>
                <div className={styles.sign_or}>
                    <p className={styles.sing_or__title}>or Sign up with</p>
                    <div className={styles.sing_or__links}>
                        <a href="https://www.google.ru/" className={styles.sing_in__link}>
                            <img width={52} height={52} src="./icons/google-logo.svg" alt="google logo" />
                        </a>
                        <a href="https://www.google.ru/" className={styles.sing_in__link}>
                            <img width={52} height={52} src="./icons/github-logo.svg" alt="github logo" />
                        </a>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Registration