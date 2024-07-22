import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuthContext } from "../../Contexts/AuthContext"


import HeaderStyles from "./header.module.scss"
const Header = () => {
    const { user, logout } = useAuthContext()

    const [isUserAuth, setIsUserAuth] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (user) {
            setIsUserAuth(true)
        } else {
            setIsUserAuth(false)
        }
    }, [user])

    const handleLogout = () => {
        const userToken = localStorage.getItem("userToken")
        if (userToken) {
            logout(userToken)
        }
    }

    return (
        <header className={HeaderStyles.header}>
            <div className="container">
                <div className={HeaderStyles.headerInner}>
                    <Link to="/">
                        <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
                    </Link>
                    <div className={HeaderStyles.userMenu}>
                        <button >
                            <img width={24} height={24} src="./icons/faq.svg" alt="faq" />
                        </button>
                        {user &&
                            <Link to="/profile">
                                <button className={HeaderStyles.userSetting}>
                                    <img width={24} height={24} src="./icons/setting.svg" alt="user settings" />
                                </button>
                            </Link>}
                        {isUserAuth ? (<div className={HeaderStyles.user}>
                            <div className={HeaderStyles.userAvatar}>
                                <img width={15} height={18} src="./icons/user-avatar.svg" alt="user avatar" />
                            </div>
                            {user && user.email && (
                                <p className={HeaderStyles.userName}>{user.email}</p>)}
                            <div className={HeaderStyles.userDnd}>
                                <img width={17} height={17}
                                    src="./icons/drop-downn.svg"
                                    alt="user avatar"
                                    style={{ transform: `rotate(${isOpen ? "180deg" : "0deg"})` }}
                                    onClick={() => setIsOpen(!isOpen)}
                                />
                                {isOpen &&
                                    <div className={HeaderStyles.userDndHide}  >
                                        <span onClick={handleLogout} >Log out</span>
                                    </div>}
                            </div>
                        </div>) : (<Link to="/login">
                            <span className={HeaderStyles.signIn}>Sign in </span>
                        </Link>)}

                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header