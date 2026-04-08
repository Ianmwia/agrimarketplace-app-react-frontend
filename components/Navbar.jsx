import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, Monitor, User, LogOut, X, Home, Lock, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { User2 } from 'lucide-react';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { toast } from 'sonner';
import API from '../src/api';
import { useAuth } from '@/context/useAuth';

import SearchMarketplace from './SearchMarketplace';

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
                {/* Theme dropdown */}
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                            {theme  === 'light' && <Sun className='h-5 w-5'/>}
                            {theme  === 'dark' && <Moon className='h-5 w-5'/>}
                            {theme  === 'system' && <Monitor className='h-5 w-5'/>}
                            <span className='sr-only'>Toggle Theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem onClick={()=> setTheme('light')}>
                            <Sun className='mr-2 h-4 w-4'/> Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=> setTheme('dark')}>
                            <Moon className='mr-2 h-4 w-4'/> Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=> setTheme('system')}>
                            <Monitor className='mr-2 h-4 w-4'/> System</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu> 

                {/*dropdown */}
            {user && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='flex items-center gap-2 px-2 h-10 hover:bg-muted rounded-md'>
                            <Avatar className='h-8 w-8 shrink-0'>
                                <AvatarImage src={user?.image} className='w-full h-full object-cover'/>
                                <AvatarFallback>
                                    <User2 className='w-5 h-5 rounded-full'/>
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

export default function Navbar({onSearch, showSearch}){
    
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
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 gap-1 group`}>
                <img className='h-8 w-8 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110' 
                src="/public/farmer-svgrepo-com.svg" alt="logo-kilimo" />
                <Link to='/' className='text-4xl font-bold tracking-tighter'>Kilimo</Link>
            </div>
            ): (
                <div className='lg:order-1 lg:ml-auto flex items-center gap-1 group'>
                <img className='h-8 w-8 transition-all duration-500 group-hover:animate-spin group-hover:scale-110' 
                src="/public/farmer-svgrepo-com.svg" alt="logo-kilimo" />
                <p className='text-4xl font-bold tracking-tighter'>Kilimo</p>
                </div>
            )}

            {/*nav for links */}
            <nav className='hidden md:flex items-center gap-8 text-sm font-medium lg:order-3 lg:mr-10'>
                {/* {!user && (
                    <Link to='/' className='text-foreground relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-foreground after:transition-all after:duration-300 hover:after:w-full'>Home</Link>
                )} */}

                {/*role links */}
                {user?.role === 'buyer' && 
                <Link to='/market' className='text-foreground text-lg font-bold'>Market</Link>
                }
                {user?.role === 'farmer' &&
                <Link to='/farmer' className='text-foreground text-lg font-bold'>Farmer</Link>
                }
                {user?.role === 'field_officer' &&
                <Link to='/field_officer' className='text-foreground text-lg font-bold'>Field Officer Reports</Link>
                }
                {user && 
                <Link to='/thread' className='text-foreground text-lg font-bold'>Chat</Link>
                }
                {/*not logged in */}
                {/* {!user && 
                <Link to='/login' className='text-foreground'>Login</Link>
                } */}
                
            </nav>

            {/*theme toggle */}
            <div className='hidden md:flex items-center gap-3 lg:order-4 lg:mr-auto'>
                <NavActions {...actionProps}/> 
            </div>

            {showSearch && (
                <div className='hidden lg:flex items-center justify-center px-6 lg:order-2 lg:mx-auto'>
                    <div className=''>
                    <SearchMarketplace onSearch={onSearch}/>
                    </div>
                </div>
            )}

            {/*hamburger menu */}
            <div className='md:hidden flex items-center lg:order-5'>
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