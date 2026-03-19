import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, User, LogOut, X, Home, Lock, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { toast } from 'sonner';
import API from '../src/api';
import { useAuth } from '@/context/useAuth';

const NavActions = ({isMobile, user, setUser, setTheme, theme, setIsOpen, navigate}) => {
        //logout function
        const handleLogout = async () => {
            try {
                await API.post('logout/')
                toast.success('Logout Successful')
            } catch{
                toast.error('Logout Error')
            }
            localStorage.removeItem('token')
            setUser(null)
            navigate('/login')
            setIsOpen(false)
        }
        //icons
        return(
            <div className={`flex items-center gap-3 ${isMobile ?  "flex-col scale-150 mt-4" : ""}`}>
                <Button variant='ghost' size='icon'
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'></Sun>
                    <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'></Moon>
                    <span className='sr-only'>Toggle theme</span>
                </Button>   

                {/*dropdown */}
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='flex items-center gap-2 px-2 h-10 hover:bg-muted rounded-md'>
                            <Avatar className='h-8 w-8 shrink-0'>
                                <AvatarImage src={user?.image} className='w-full h-full object-cover'/>
                                <AvatarFallback>
                                    pfp
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                        <DropdownMenuItem asChild>
                            <Link to='/profile' onClick={()=> setIsOpen(false)}
                            className='flex items-center cursor-pointer w-full'
                            >Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}
                        className='text-red-600 cursor-pointer'
                        >
                            <LogOut className='mr-2 h-4 w-4'/>
                            <span>Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
                    
            </div>
        )
    }

export default function Navbar(){
    const {theme, setTheme} = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const {user, setUser} = useAuth()

    const actionProps = {
        user,
        setUser, theme, setTheme, setIsOpen, navigate
    }

    return(
        <header className='dark:bg-green/90 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur'>
            <div className='container mx-auto flex flex-row-reverse h-16 items-center justify-between px-4 relative'>
            {/*brand web name */}
            {!user ?( 
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300`}>
                <Link to='/' className='text-4xl font-bold tracking-tighter'>Kilimo</Link>
            </div>
            ): (
                <div>
                <p className='text-4xl font-bold tracking-tighter'>Kilimo</p>
                </div>
            )}

            {/*nav for links */}
            <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
                {/* {!user && (
                    <Link to='/' className='text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full'>Home</Link>
                )} */}

                {/*role links */}
                {user?.role === 'buyer' && 
                <Link to='/market' className='text-foreground'>Market</Link>
                }
                {user?.role === 'farmer' &&
                <Link to='/farmer' className='text-foreground'>Farmer</Link>
                }
                {user?.role === 'field_officer' &&
                <Link to='/field_officer' className='text-foreground'>Field Officer Reports</Link>
                }
                {user && 
                <Link to='/thread' className='text-foreground'>Chat</Link>
                }
                {/*not logged in */}
                {/* {!user && 
                <Link to='/login' className='text-foreground'>Login</Link>
                } */}
                
            </nav>

            {/*theme toggle */}
            <div className='hidden md:flex items-center gap-3'>
                <NavActions {...actionProps}/> 
            </div>

            {/*hamburger menu */}
            <div className='md:hidden flex items-center'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant='ghost' size='icon' className='ml-1'>
                            {isOpen ? <X className='h-6 w-6' /> :<Menu className='h-6 w-6'/>}
                        </Button>
                    </SheetTrigger>
                
                
                <SheetContent side='top' className='w-full pt-20 pb-10 border-b shadow-xl'>
                    {/*dialog sheet title and head required */}
                    <SheetHeader>
                        <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
                    </SheetHeader>
                    <nav className='flex flex-col items-center gap-8'>
                        <SheetClose asChild>
                            {!user && (
                            <Link to='/' className='text-2xl font-semibold'>Home</Link>                        
                            )}
                            </SheetClose>
                        {user?.role === 'farmer' && (
                        <SheetClose asChild>
                            
                            <Link to='/farmer' className='text-2xl font-semibold'>Farmer</Link>  
                                                 
                        </SheetClose>
                        )}
                        {user?.role === 'buyer' &&(
                        <SheetClose asChild>
                            <Link to='/market' className='text-2xl font-semibold'>Marketplace</Link>                        
                        </SheetClose>
                        )}
                        {user?.role === 'field_officer' &&(
                        <SheetClose asChild>
                            <Link to='/field_officer' className='text-2xl font-semibold'>Field Officer Reports</Link>                        
                        </SheetClose>
                        )}
                        {user &&(
                        <SheetClose asChild>
                            <Link to='/profile' className='text-2xl font-semibold'>Profile</Link>                        
                        </SheetClose>
                        )}
                        {user &&(
                        <SheetClose asChild>
                            <Link to='/thread' className='text-foreground'>Chat</Link>
                        </SheetClose>
                        )}
                        {/*mobile login */}
                        {!user &&(
                        <SheetClose asChild>
                            <Link to='/login' className='text-foreground'>Login</Link>
                        </SheetClose>
                        )}

                        <NavActions {...actionProps} isMobile/>

                    </nav>

                </SheetContent>
                </Sheet>
            </div>
        </div>
        </header>
    )
}