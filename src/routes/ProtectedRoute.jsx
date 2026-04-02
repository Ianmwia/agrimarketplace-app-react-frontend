import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProtectedRoute({children, allowedRoles}){
    const {user, loading} = useAuth()

    if (loading){
        return (
            <div className='flex h-screen w-full flex-col items-center justify-center space-y-4 p-8'>
                <div className='relative flex items-center justify-center'>
                <Skeleton className='h-32 w-32 rounded-full'/>
                    <span className='absolute text-xl font-bold tracking-tighter text-muted-foreground animate-pulse'>
                        KILIMO
                    </span>
                </div>
            </div>
        )
    }

    if(!user)  return <Navigate to='/login'/>

    if (allowedRoles && !allowedRoles.includes(user.role)){
        return <Navigate to='/' />
    }
    return children
}