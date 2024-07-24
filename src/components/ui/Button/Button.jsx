import React from "react";
import classNames from "classnames";
import styles from "../../Auth/Registration/registration.module.scss";

const Button = ({ children, className }) => {
  return (
    <button
      className={classNames(styles.login__btn, className, {
        secondary: styles.secondary,
        main: styles.main
      })}
    >
      {children}
    </button>
  );
};

export default Button;
