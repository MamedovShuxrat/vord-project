import React from "react"
import { Link } from "react-router-dom"

const homePage = () => {
    return (
        <div>
            Тут главная страница !
            <Link to="/register">
                Зарегистрироваться
            </Link>
        </div>
    )
}

export default homePage