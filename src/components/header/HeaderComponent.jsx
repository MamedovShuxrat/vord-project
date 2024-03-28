import React from 'react'
import { Link } from 'react-router-dom'
import HeaderStyles from './header.module.scss'

const HeaderComponent = () => {
    return (
        <header className={HeaderStyles.header}>
            <div className="container">
                <div className={HeaderStyles.header__inner}>
                    <Link to='/'>
                        <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
                    </Link>
                    <div className={HeaderStyles.user__menu}>
                        <button >
                            <img width={24} height={24} src="./icons/btn-faq.png" alt="faq" />
                        </button>
                        <button className={HeaderStyles.user__setting}>
                            <img width={24} height={24} src="./icons/setting.svg" alt="user settings" />
                        </button>
                        <div className={HeaderStyles.user}>
                            <div className={HeaderStyles.user__avatar}>
                                <img width={15} height={18} src="./icons/user-avatar.svg" alt="user avatar" />
                            </div>
                            <p className={HeaderStyles.user__name}>{'12121'}</p>
                            <div className={HeaderStyles.user__dnd}>
                                <img width={17} height={17} src="./icons/drop-downn.svg" alt="user avatar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderComponent