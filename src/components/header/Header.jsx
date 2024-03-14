import React from 'react'
import { Link } from 'react-router-dom'
import './header.scss'

const Header = () => {
    return (
        <header className='header'>
            <div className="container">
                <div className="header__inner">
                    <Link to='/'>
                        <img width={32} height={32} src="./icons/main-logo.svg" alt="main logo" />
                    </Link>
                    <div className="user__menu">
                        <button className="user__faq">
                            <img width={17} height={17} src="./icons/faq.svg" alt="faq" />
                        </button>
                        <button className="user__setting">
                            <img width={24} height={24} src="./icons/setting.svg" alt="user settings" />
                        </button>
                        <div className="user">
                            <div className="user__avatar">
                                <img width={15} height={18} src="./icons/user-avatar.svg" alt="user avatar" />
                            </div>
                            <p className="user__name">{'12121'}</p>
                            <div className="user__dnd">
                                <img width={17} height={17} src="./icons/drop-downn.svg" alt="user avatar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header