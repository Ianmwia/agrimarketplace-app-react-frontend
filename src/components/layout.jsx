import { Outlet } from 'react-router-dom';

import Navbar from '../../components/Navbar';
import { useState } from 'react';

const Layout = () => {

    const [searchQuery, setSearchQuery] = useState('')
    return(
        <div className='flex min-h-screen flex-col'>
        <Navbar showSearch={true} onSearch={setSearchQuery}/>
            <main className='flex-1'>
                <Outlet context={{searchQuery, setSearchQuery}}/>
            </main>
        </div>
    )
}

export default Layout