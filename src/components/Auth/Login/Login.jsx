import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../core/store/userSlice";

import styles from "../Registration/registration.module.scss";
import SimpleInput from "../../ui/Inputs/SimpleInput";
import AuthPasswordInput from "../../ui/Inputs/AuthPasswordInput";
import Button from "../../ui/Button/Button";

import mainLogoSvg from "../../../assets/images/icons/common/main-logo.svg";

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (user) {
      setRedirect(true);
    }
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (redirect) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className={styles.register}>
      <div className={styles.register__title_wrapper}>
        <h2 className={styles.register__title}>Log in to VARD</h2>
        <img width={32} height={32} src={mainLogoSvg} alt="main logo" />
      </div>
      <form onSubmit={handleLoginSubmit}>
        <SimpleInput
          placeholder="Email"
          className="loginInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <AuthPasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className={styles.main}>Log in</Button>
        <span className={styles.login__or}>or</span>
        <Link to="/register">
          <Button className={styles.secondary}>Create account</Button>
        </Link>
        {status === "failed" && <p className={styles.error}></p>}
      </form>
    </div>
  );
};

export default Login;
