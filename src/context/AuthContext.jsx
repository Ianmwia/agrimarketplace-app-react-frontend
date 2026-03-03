import { useState } from 'react';
import { createContext, useContext, useEffect } from 'react';
import API from '@/api';

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) //start as true to prevent url type set null
    
    useEffect(()=> {
        API.get('me/')
        .then(res => {
            setUser(res.data)
        })
        .catch(()=> {
            setUser(null)
        })
        .finally(()=>{
            setLoading(false) //stop loading no matter what
        })
    }, [])

    return(
        <AuthContext.Provider value={{ user, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)