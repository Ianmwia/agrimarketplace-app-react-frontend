import { useState, useEffect } from 'react'
import API from '@/api';
import { AuthContext } from './AuthContext';


export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) //start as true to prevent url type set null
    
    useEffect(()=> {
        const initializeAuth = async () => {
            try {
                //priming get cookie
                await API.get('csrf/')
                //ask question, ho who is you
                const res = await API.get('me/')
                setUser(res.data)
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    return(
        <AuthContext.Provider value={{ user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    )
}