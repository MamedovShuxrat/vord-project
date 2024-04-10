import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useAuthContext } from '../../Contexts/AuhtContext'

import styles from '../Registration/registration.module.scss'
import SimpleInput from '../Inputs/SimpleInput'
import AuthPasswordInput from '../Inputs/AuthPasswordInput'
import Button from '../Button/Button'

const Login = () => {
    const { login } = useAuthContext();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [redirect, setRedirect] = useState(false)

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            // setRedirect(true)
        } catch (error) {
            console.log('Login failed:', error)

        }

    }

    // if (redirect) {
    //     return <Redirect to='/dashboard' />
    // }
    return (
        <div className={styles.register}>
            <div className={styles.register__title_wrapper}>
                <h2 className={styles.register__title}>Log in to VARD  </h2>
                <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
            </div>
            <form onSubmit={handleLoginSubmit}>
                <SimpleInput
                    placeholder='Email'
                    className="loginInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                <AuthPasswordInput
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                <Button className={styles.main} >Log in</Button>
                <span className={styles.login__or}>or</span>
                <Link to='/register'>
                    <Button className={styles.secondary} >Create account</Button>
                </Link>
            </form>
        </div>
    )
}

export default Login