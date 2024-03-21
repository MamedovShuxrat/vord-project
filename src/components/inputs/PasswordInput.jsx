import React, { useState } from 'react';
import inputStyles from './inputs.module.scss'

const PasswordInput = ({ placeholder }) => {
    const [showPassword, setShowPassword] = useState(true);
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={inputStyles.password__input} >
            <input className={inputStyles.login__input}
                type={showPassword ? 'password' : 'text'}
                placeholder={placeholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <img onClick={togglePasswordVisibility} className={inputStyles.login__eyes} width={18} height={18} src='./icons/eye.svg' alt='Show password' />

        </div>
    );
};

export default PasswordInput;
