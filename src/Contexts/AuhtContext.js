import React, { createContext, useState, useContext } from "react"
import axios from 'axios'
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState('')

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://95.163.185.57/auth/login/', { email, password });
            console.log(response, 'success');
            toast.success('Success login')
            setUser({ email });
        } catch (error) {
            console.log('Login failed:', error);
            toast.error(error.response.request.statusText)

        }
    };

    const logout = () => {
        setUser(null)
    }

    const contextValue = {
        user,
        login,
        logout
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)