import React from 'react'
import classNames from 'classnames'

const Button = ({ children, className }) => {
    return (
        <button className={classNames('login__btn', className)}>
            {children}
        </button>
    )
}

export default Button