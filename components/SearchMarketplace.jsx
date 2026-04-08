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
        <div className='relative flex lg:items-center lg:my-4 flex-col md:flex-row gap-4 mb-8 md:w-[47%] md:mx-auto lg:w-3xs bg-card border rounded-xl shadow-sm'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10'/>
                <Input
                value={searchTerm}
                className='pl-8 border-none bg-transparent focus-visible:ring-0 shadow-none'
                placeholder="search by produce name or location..."
                onChange = {(e)=> setSearchTerm(e.target.value)}
                
                />
        </div>
    )

}