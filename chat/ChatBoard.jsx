
import { useEffect, useState, useRef } from 'react';
import API from '@/api';
import { useAuth } from '@/context/useAuth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from 'radix-ui';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,CommandList } from 'lucide-react';
import { Send, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Chat(){
    const {user} = useAuth()
    const [threads, setThreads] = useState([])
    const [activeThread, setActiveThread] = useState(null)
    const[messages] = useState([])
    const[text] = useState("")
    const[usersList] = useState([])
    const[isDialogOpen] = useState(false)

    //websockets
    const socketRef = useRef(null)
    const scrollRef = useRef(null)

    //fetch users and threads
    useEffect(()=>{

    },[])
    //scroll feature

    return(
        <div className='flex h-[85vh] bg-background border rounded-2xl overflow-hidden m-6 shadow-xl'>
            <h1></h1>
        </div>
    )
}

