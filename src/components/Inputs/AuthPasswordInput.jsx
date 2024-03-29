import React, { useState } from 'react';
import inputStyles from './inputs.module.scss'

const AuthPasswordInput = ({ placeholder }) => {
    const [showPassword, setShowPassword] = useState(true);
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={inputStyles.loginPassword} >
            <input className={inputStyles.loginInput}
                type={showPassword ? 'password' : 'text'}
                placeholder={placeholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <img onClick={togglePasswordVisibility} className={inputStyles.loginEyes} width={18} height={18} src='./icons/eye.svg' alt='Show password' />

        </div>
    );
};

export default AuthPasswordInput;
