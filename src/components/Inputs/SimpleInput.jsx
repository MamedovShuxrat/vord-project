import React from 'react'
import inputStyles from './inputs.module.scss'


const SimpleInput = ({ placeholder, className, value, onChange }) => {
    return (
        <input
            type="text"
            className={`${inputStyles[className]}`}
            placeholder={placeholder}
            required
            value={value}
            onChange={onChange}
        />
    )
}

export default SimpleInput