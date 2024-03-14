import React, { useState } from 'react';

const PasswordInput = ({ placeholder }) => {
    const [showPassword, setShowPassword] = useState(true);
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='password__input' >
            <input className='login__input'
                type={showPassword ? 'password' : 'text'}
                placeholder={placeholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <img onClick={togglePasswordVisibility} className='login__eyes' width={18} height={18} src='./icons/eye.svg' alt='Show password' />

        </div>
    );
};

export default PasswordInput;
