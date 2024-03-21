import React from 'react'
import styles from '../registration/registration.module.scss'

import SimpleLoginInput from '../inputs/SimpleLoginInput'
import PasswordInput from '../inputs/PasswordInput'
import Button from '../button/Button'

const Login = () => {
    return (
        <div className={styles.register}>
            <div className={styles.register__title_wrapper}>
                <h2 className={styles.register__title}>Log in to VARD  </h2>
                <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
            </div>
            <SimpleLoginInput placeholder='Email' />
            <PasswordInput placeholder='Password' />
            <Button className={styles.main} >Log in</Button>
        </div>

    )
}

export default Login