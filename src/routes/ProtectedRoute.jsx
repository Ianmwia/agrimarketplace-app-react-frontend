import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProtectedRoute({children, allowedRoles}){
    const {user, loading} = useAuth()

    if (loading){
        return (
            <div className=' flex flex-col space-y-3 p-8'>
                <Skeleton className='h-31.25 w-62.5 rounded-xl'/>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-62.5' />
                        <Skeleton className='h-4 w-62.5' />
                    </div>
            </div>
        )
    }

    if(!user)  return <Navigate to='/login'/>

    if (allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to='/home' />
    }
    return children
}