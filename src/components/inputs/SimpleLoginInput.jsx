import React from 'react'
import inputStyles from './inputs.module.scss'


const SimpleLoginInput = ({ placeholder }) => {
    return (
        <input type="text" className={inputStyles.login__input} placeholder={placeholder} required />
    )
}

export default SimpleLoginInput