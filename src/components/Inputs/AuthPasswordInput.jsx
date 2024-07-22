import React, { useState } from "react";
import inputStyles from "./inputs.module.scss"

const AuthPasswordInput = ({ placeholder, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(true);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className={inputStyles.loginPassword} >
            <input className={inputStyles.loginInput}
                type={showPassword ? "password" : "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
            <img onClick={togglePasswordVisibility} className={inputStyles.loginEyes} width={18} height={18} src="./icons/eye.svg" alt="Show password" />

        </div>
    );
};

export default AuthPasswordInput;
