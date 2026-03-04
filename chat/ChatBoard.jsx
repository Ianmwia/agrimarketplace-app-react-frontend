
import { useEffect, useState, useRef } from 'react';
import API from '@/api';
import { useAuth } from '@/context/useAuth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, Dialog, DialogContent, DialogTrigger } from 'radix-ui';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,CommandList } from 'lucide-react';
import { Send, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { AvatarFallback } from '@/components/ui/avatar';

export default function Chat(){
    const {user} = useAuth()
    const [threads, setThreads] = useState([])
    const [activeThread, setActiveThread] = useState(null)
    const[messages, setMessages] = useState([])
    const[text, setText] = useState("")
    const[usersList, setUsersList] = useState([])
    const[isDialogOpen, setIsDialogOpen] = useState(false)

    //websockets
    const socketRef = useRef(null)
    const scrollRef = useRef(null)

    //fetch users and threads
    useEffect(()=>{
        API.get('threads/').then(res => setThreads(res.data))
        API.get('users/').then(res => setThreads(res.data)).catch(()=>{})

    },[])
    //scroll feature
    useEffect(()=>{
        if (scrollRef.current){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    },[messages])

    //find out who the person is
    const getOtherParticipant = (thread) => {
        if (!thread) return {name: "Unknown", role: ""}
        const isUser1 = thread.user1 === user?.id || thread.user1 === user?.email
        return {
            name: isUser1 ? thread.user2_name : thread.user1_name,
            role: isUser1 ? thread.user2_role : thread.user1_role,
        }
    }

    //web sockets connection using django channels and upstash redis hosting
    useEffect(()=>{
        if (!activeThread) return

        setMessages(activeThread.messages || [])

        //web socket api use wss
        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${activeThread.id}/`)
        socketRef .current = socket

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log('Websocket Received:', data)
            setMessages(prev => [...prev, data])
        }
        return()=> socketRef.current?.close()
    },[activeThread])

    const sendMessage = () => {
        if (!text.trim() || !socketRef.current) return
        socketRef.current.send(JSON.stringify({message: text}))
        setText("")
    }

    //start a new chat
    const startNewChat = async (targetId) => {
        try {
            const res = await API.post('threads/', {user2: targetId})
            const newThread = res.data
            setThreads(prev => {
                const exists = prev.find(t => t.id === newThread.id)
                return exists ? prev : [newThread, ...prev]
            })
            setActiveThread(newThread)
            setIsDialogOpen(false)
        } catch {
            toast.error("Error starting chat")
        }
    }

    return(
        <div className='flex h-[85vh] bg-background border rounded-2xl overflow-hidden m-6 shadow-xl'>
            {/*sidebar */}
            <div>
                <div>
                    <h2>
                        Kilimo Chat
                    </h2>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" size='icon'>
                                <Plus className='h-4 w-4'/>
                            </Button>
                        </DialogTrigger>

                        {/*dialogcontent */}
                        <DialogContent>
                            <Command>
                                <CommandInput placeholder="Search Farmers or officers"/>
                                <CommandList>
                                    <CommandEmpty>No users found</CommandEmpty>
                                    <CommandGroup heading="Available Contacts">
                                        {usersList.map((u) => (
                                            <CommandItem key={u.id} onSelect={()=> startNewChat(u.id)}>
                                                <Avatar>
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                                <div className='flex flex-col'>
                                                    <span className='font-medium text-sm'>{u.name || `${u.first_name} ${u.last_name}`}</span>
                                                    <span className='text-[10px] opacity-50'>{u.role}</span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </DialogContent>
                    </Dialog>
                </div>

                {/*another participant */}
                
            </div>
        </div>
    )
}

