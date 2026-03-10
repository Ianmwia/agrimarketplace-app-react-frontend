import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function SearchMarketplace({onSearch}){
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(()=>{
        const delayBounceFn = setTimeout(()=>{
            if (typeof onSearch === 'function'){
                onSearch(searchTerm)}
        }, 500)

        return ()=> clearTimeout(delayBounceFn)
    }, [searchTerm, onSearch])

    return (
        <div className='flex flex-col md:flex-row gap-4 mb-8 md:w-[47%] md:mx-auto lg:w-[38%] bg-card border rounded-xl shadow-sm'>
                <Input
                value={searchTerm}
                placeholder="search by produce name or location..."
                onChange = {(e)=> setSearchTerm(e.target.value)}
                
                />
        </div>
    )

}