import React from 'react'
import { Link } from 'react-router-dom'
import './registration.scss'
import Button from '../button/Button'
import SimpleLoginInput from '../inputs/SimpleLoginInput'
import PasswordInput from '../inputs/PasswordInput'

const Registration = () => {
    return (
        <div className='register'>
            <div className="register__title-wrapper">
                <h2 className="register__title">Welcome to VARD  </h2>
                <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
            </div>
            <form action="/get">
                <SimpleLoginInput placeholder='Name' />
                <SimpleLoginInput placeholder='Email' />
                <PasswordInput placeholder='Password' />
                <PasswordInput placeholder='Confirm password' />
                <div className="login__privacy">
                    <input type="checkbox" className="login__checkbox" />
                    <span className="login__privacy-text">I agree with</span>
                    <a href="#" className="login__privacy-link">Terms of service</a>
                    <span className="login__privacy-text">and</span>
                    <a href="#" className="login__privacy-link">Privacy policy</a>
                </div>
                <Button className='main' >Create account</Button>
                <span className="login__or">or</span>
                <Link to='/login'>
                    <Button className='secondary' >Log in</Button>
                </Link>
                <div className="sign-or">
                    <p className="sing-or__title">or Sign up with</p>
                    <div className="sing-or__links">
                        <a href="https://www.google.ru/" className="sing-in__link">
                            <img width={52} height={52} src="./icons/google-logo.svg" alt="google logo" />
                        </a>
                        <a href="https://www.google.ru/" className="sing-in__link">
                            <img width={52} height={52} src="./icons/github-logo.svg" alt="github logo" />
                        </a>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Registration