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


export default function Navbar(){
    const {theme, setTheme} = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    {/*group nav actions for sheet dropdown */}
    const NavActions = ({isMobile}) => {
        //logout function
        const handleLogout = async () => {
            try {
                await API.post('logout/')
                toast.success('Logout Successful')
            } catch (error) {
                toast.error('Logout Error')
            }
            localStorage.removeItem('token')
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='relative h-8 w-8 rounded-full p-0'>
                            <Avatar className='h-10 w-10 ml-2'>
                                <AvatarImage src=''/>
                                <AvatarFallback>JD</AvatarFallback>
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
                    
            </div>
        )
    }

    return(
        <header className='bg-green-500 dark:bg-green-900 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur'>
            <div className='container mx-auto flex h-16 items-center justify-between px-4'>
            {/*brand web name */}
            <div>
                <p className='text-2xl font-bold tracking-tighter'>Kilimo</p>
            </div>

            {/*nav for links */}
            <nav className='hidden md:flex items-center gap-8 text-sm font-medium'>
                <Link to='/home' className='text-muted-foreground hover:text-foreground'>Home</Link>
                <Link to='/market' className='text-muted-foreground hover:text-foreground'>Market</Link>
                <Link to='/farmer' className='text-muted-foreground hover:text-foreground'>Farmer</Link>
            </nav>

            {/*theme toggle */}
            <div className='hidden md:flex items-center gap-3'>
                <NavActions/> 
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
                            <Link to='/home' className='text-2xl font-semibold'>Home</Link>                        
                        </SheetClose>
                        <SheetClose asChild>
                            <Link to='/profile' className='text-2xl font-semibold'>Profile</Link>                        
                        </SheetClose>

                        <NavActions isMobile/>

                    </nav>

                </SheetContent>
                </Sheet>
            </div>
        </div>
        </header>
    )
}