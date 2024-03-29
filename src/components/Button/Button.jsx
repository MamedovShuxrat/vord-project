import React from 'react'
import classNames from 'classnames'
import styles from '../Registration/registration.module.scss'

const Button = ({ children, className }) => {
    console.log('Мистика');
    return (
        <button className={classNames(styles.login__btn, className, {
            'secondary': styles.secondary,
            'main': styles.main
        })}>
            {children}
        </button>
    )
}

export default Button