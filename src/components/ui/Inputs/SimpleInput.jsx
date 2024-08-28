import React from "react";
import inputStyles from "./inputs.module.scss";

const SimpleInput = ({ type = "text", placeholder, name, value, className, onChange }) => {
  return (
    <input
      type={type}
      className={`${inputStyles[className]}`}
      placeholder={placeholder}
      name={name}
      required
      value={value}
      onChange={onChange}
    />
  );
};

export default SimpleInput;
