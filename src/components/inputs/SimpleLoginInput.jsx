import React from 'react'
import './inputs.scss'

const SimpleLoginInput = ({ placeholder }) => {
    return (
        <input type="text" className='login__input' placeholder={placeholder} required />
    )
}

export default SimpleLoginInput