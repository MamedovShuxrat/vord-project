import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
    return (
        <div>
            Тут главная страница !
            <Link to='/register'>
                Зарегистрироваться
            </Link>
        </div>
    )
}

export default HomePage