import React from 'react'
import inputStyles from './inputs.module.scss'


const SimpleInput = ({ placeholder, className }) => {
    return (
        <input type="text" className={`${inputStyles[className]}`} placeholder={placeholder} required />
    )
}

export default SimpleInput