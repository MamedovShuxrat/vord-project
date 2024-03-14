import React from 'react'
import '../registration/registration.scss'
import SimpleLoginInput from '../inputs/SimpleLoginInput'
import PasswordInput from '../inputs/PasswordInput'
import Button from '../button/Button'

const Login = () => {
    return (
        <div className='register'>
            <div className="register__title-wrapper">
                <h2 className="register__title">Log in to VARD  </h2>
                <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
            </div>
            <SimpleLoginInput placeholder='Email' />
            <PasswordInput placeholder='Password' />
            <Button className='main' >Log in</Button>
        </div>

    )
}

export default Login