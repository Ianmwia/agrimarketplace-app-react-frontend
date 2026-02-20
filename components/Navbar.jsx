import { Link } from 'react-router-dom';
import { Moon, Sun, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';


export default function Navbar(){
    const {theme, setTheme} = useTheme()

    return(
        <nav className='bg-green-500'>
            <div>Kilimo</div>

            <div>
                <Link href='/home'>Home</Link>
                <Link href=''>Auth Page</Link>
            </div>

            {/*theme toggle */}
            <div>
                <Button variant='ghost' size='icon'
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'></Sun>
                    <Moon className='absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'></Moon>
                    <span className='sr-only'>Toggle theme</span>
                </Button>   
            </div>

            {/*profile */}
            <div>
                <Link to='/profile'>
                    <Avatar className='h-8 w-8 ml-2'>
                        <AvatarImage src=''/>
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </nav>
    )
}