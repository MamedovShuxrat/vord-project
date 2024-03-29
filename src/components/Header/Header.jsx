import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import HeaderStyles from './header.module.scss'
const Header = () => {
    const [isUserAuth, setIsUserAuth] = useState(false)
    return (
        <header className={HeaderStyles.header}>
            <div className="container">
                <div className={HeaderStyles.headerInner}>
                    <Link to='/'>
                        <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
                    </Link>
                    <div className={HeaderStyles.userMenu}>
                        <button >
                            <img width={24} height={24} src="./icons/faq.svg" alt="faq" />
                        </button>
                        <button className={HeaderStyles.userSetting}>
                            <img width={24} height={24} src="./icons/setting.svg" alt="user settings" />
                        </button>
                        {isUserAuth ? (<div className={HeaderStyles.user}>
                            <div className={HeaderStyles.userAvatar}>
                                <img width={15} height={18} src="./icons/user-avatar.svg" alt="user avatar" />
                            </div>
                            <p className={HeaderStyles.userName}>{'12121'}</p>
                            <div className={HeaderStyles.userDnd}>
                                <img width={17} height={17} src="./icons/drop-downn.svg" alt="user avatar" />
                            </div>
                        </div>) : (<Link to='/login'>
                            <span className={HeaderStyles.signIn}>Sign in </span>
                        </Link>)}

                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header