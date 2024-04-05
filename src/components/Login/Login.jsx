import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import styles from '../Registration/registration.module.scss'

import SimpleInput from '../Inputs/SimpleInput'
import AuthPasswordInput from '../Inputs/AuthPasswordInput'
import Button from '../Button/Button'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://95.163.185.57/api/users/', { email, password })
            console.log(response);
        } catch (error) {
            toast.error('Login failed:')
            console.log('Login failed:', error.response);
        }
    }
    return (
        <div className={styles.register}>
            <div className={styles.register__title_wrapper}>
                <h2 className={styles.register__title}>Log in to VARD  </h2>
                <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
            </div>
            <form onSubmit={handleLoginSubmit}>

                <SimpleInput placeholder='Email' className="loginInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />

                <AuthPasswordInput placeholder='Password'
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