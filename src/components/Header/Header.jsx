import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../core/store/userSlice";

import HeaderStyles from "./header.module.scss";

import settingSvg from "../../assets/images/icons/header/setting.svg";
import dropDownSvg from "../../assets/images/icons/header/drop-downn.svg";
import faqSvg from "../../assets/images/icons/header/faq.svg";
import userAvatarImg from "../../assets/images/icons/common/user-avatar.svg";
import mainLogoSvg from "../../assets/images/icons/common/main-logo.svg";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [isUserAuth, setIsUserAuth] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setIsUserAuth(true);
    } else {
      setIsUserAuth(false);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
  };

  return (
    <header className={HeaderStyles.header}>
      <div className="container">
        <div className={HeaderStyles.headerInner}>
          <Link to="/">
            <img width={32} height={32} src={mainLogoSvg} alt="main logo" />
          </Link>
          <div className={HeaderStyles.userMenu}>
            <button>
              <img width={24} height={24} src={faqSvg} alt="faq" />
            </button>
            {user && (
              <Link to="/profile">
                <button className={HeaderStyles.userSetting}>
                  <img
                    width={24}
                    height={24}
                    src={settingSvg}
                    alt="user settings"
                  />
                </button>
              </Link>
            )}
            {isUserAuth ? (
              <div className={HeaderStyles.user}>
                <div className={HeaderStyles.userAvatar}>
                  <img
                    width={15}
                    height={18}
                    src={userAvatarImg}
                    alt="user avatar"
                  />
                </div>
                {user && user.email && (
                  <p className={HeaderStyles.userName}>{user.username ? user.username : user.email}</p>
                )}
                <div className={HeaderStyles.userDnd}>
                  <img
                    width={17}
                    height={17}
                    src={dropDownSvg}
                    alt="user avatar"
                    style={{
                      transform: `rotate(${isOpen ? "180deg" : "0deg"})`
                    }}
                    onClick={() => setIsOpen(!isOpen)}
                  />
                  {isOpen && (
                    <div className={HeaderStyles.userDndHide}>
                      <span onClick={handleLogout}>Log out</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link to="/login">
                <span className={HeaderStyles.signIn}>Sign in </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
