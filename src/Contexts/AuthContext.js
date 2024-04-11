import React, { createContext, useState, useContext, useEffect } from "react"
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

const authLogin = process.env.REACT_APP_AUTH_LOGIN
const getUserInfo = process.env.REACT_APP_GET_USER
const authLogout = process.env.REACT_APP_AUTH_LOGOUT
const authRegister = process.env.REACT_APP_AUTH_REGISTER

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('')
    useEffect(() => {
        const userData = localStorage.getItem('userData')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    // const register = async (data) => {
    //     try {
    //         const response = await toast.promise(
    //             axios.post(authRegister, data),
    //             {
    //                 loading: 'Register in...',
    //                 success: <b>Success Register!</b>,
    //                 error: <b>Register failed: invalid username or password</b>
    //             }
    //         )
    //         toast.success('Registration successful:', response.data);
    //     } catch (error) {
    //         console.error('Registration failed:', error);
    //         throw new Error('Failed to register');
    //     }
    // }

    const register = async (name, email, password, confirmPassword) => {
        try {
            const response = await axios.post(authRegister, { name, email, password, confirmPassword })
            toast.success('Registration successful:', response.data);
            return response.data;
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error('Failed to register');
        }

    }

    // const register = async (name, email, password, confirmPassword) => {
    //     try {
    //         const response = await axios.post(authRegister, {
    //             username: name,
    //             email: email,
    //             password1: password,
    //             password2: confirmPassword
    //         });
    //     } catch (error) {
    //         console.error('Registration failed:', error);
    //         throw new Error('Failed to register');
    //     }
    // }

    const login = async (email, password) => {
        try {
            const response = await toast.promise(
                axios.post(authLogin, { email, password }),
                {
                    loading: 'Logging in...',
                    success: <b>Success login!</b>,
                    error: <b>Login failed: invalid username or password</b>
                }
            )
            getUserData(response.data.key)
            localStorage.setItem('userToken', JSON.stringify(response.data.key))
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    const getUserData = async (token) => {
        try {
            const response = await axios.get(getUserInfo, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-type': 'application/json'
                },
            })
            localStorage.setItem('userData', JSON.stringify(response.data))
            return setUser(response.data)
        } catch (error) {
            console.error('Error fetching user data:', error)
            throw new Error('Failed to fetch user data')
        }
    }

    const logout = async (token) => {
        try {
            const response = await axios.post(authLogout, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-type': 'application/json'
                }
            })
            toast.success('Logout successful', response.data);
            setUser(null)
            localStorage.removeItem('userData')
            localStorage.removeItem('userToken')

            return response.data
        } catch (error) {

            console.error('Logout failed:', error)
            throw new Error('Failed to logout')
        }
    }



    const contextValue = {
        user,
        login,
        logout,
        register
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)