
import { useEffect, useState, useRef } from 'react';
import API from '@/api';
import { useAuth } from '@/context/useAuth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent,DialogTrigger, DialogHeader,DialogTitle } from '@/components/ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,CommandList } from '@/components/ui/command'
import { Send, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';


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
        API.get('users/').then(res => setUsersList(res.data)).catch(()=>{})

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
        if (!activeThread?.id) return

        const threadId = activeThread.id
        API.get(`messages/?thread=${threadId}`).then(res=>{setMessages(res.data)}).catch(()=> setMessages([])) 

        const wsUrl = import.meta.env.VITE_WS_URL

        const socket = new WebSocket(`${wsUrl}ws/chat/${activeThread.id}/`)
        socketRef.current = socket

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data)
            setMessages((prev) => [...prev, data])
        }

        return()=> socketRef.current?.close()
    },[activeThread?.id])

    const sendMessage = () => {
        if (!text.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            toast.error('Connection not ready, please wait')
            return
        }
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
        <div className='flex flex-col md:flex-row h-[85vh] m-2 md:m-6 bg-background border rounded-2xl overflow-hidden shadow-xl'>
            {/*sidebar */}
            <div className='hidden md:flex md:w-72 lg:w-80 border-r flex-col bg-muted/20'>
                <div className='p-5 border-b flex items-center justify-between bg-background shrink-0'>
                    <h2 className='text-xl font-bold text-primary tracking-tight'>
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
                                                    <span className='font-medium text-sm md:text-base'>{u.name || `${u.first_name} ${u.last_name}`}</span>
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
                <div className='flex-1 overflow-y-auto'>
                    {threads.map(t => {
                        const other = getOtherParticipant(t);
                        return(
                            <div key={t.id} onClick={()=>setActiveThread(t)}
                            className={`flex items-center gap-4 p-4 cursor-pointer  border-b ${activeThread?.id === t.id  ? 'bg-background shadow-sm border-r-4 border-r-primary' : 'hover:bg-accent/40'}`}>
                            <Avatar>
                            <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className='flex-1 min-w-0'>
                                <p className='font-semibold text-sm truncate'>{other.name}</p>
                                <p className='text-[10px] uppercase tracking-tight'>{other.role}</p>
                            </div>
                        </div>
                            
                        )
                    })}

                </div>
            </div>

            {/*new persons thread */}
            <div className='flex-1 flex flex-col h-full bg-background relative overflow-hidden'>
                {activeThread ? (
                    <>
                        <header className='p-4 border-b flex items-center gap-3 bg-card/50 shrink-0'>
                            <Avatar>
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div className='flex-1'>
                                <p className='font-bold text-sm'>{getOtherParticipant(activeThread).name}</p>
                                <p className='font-bold text-muted-foreground capitalize mt-1'>{getOtherParticipant(activeThread).role}</p>
                            </div>
                        </header>

                        {/*messages appear here */}
                        <div
                        ref={scrollRef}
                        className='flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-muted/30 space-y-4 scroll-smooth'
                        >
                            {messages.map((msg, i) =>{
                                const isMe = msg.sender === user?.email || msg.sender_id == user?.id;
                                const displayContent = msg.text || msg.message

                                return(
                                    <div key={msg.id || i}
                                    className={`flex w-full
                                        ${isMe
                                        ? 'justify-end'
                                        : 'justify-start'
                                        }`}
                                    >
                                        <div  className={`max-w-[90%] sm:max-w-[80%] md:max-w-[65%] px-4 py-2.5 rounded-2xl wrap-break-word shadow-sm
                                        ${isMe
                                        ? 'bg-primary text-primary-foreground rounded-br-md'
                                        : 'bg-card text-foreground rounded-bl-md'
                                        }`}
                                        >
                                        <p className='leading-relaxed'>
                                            {displayContent || <span className='font-light'>Message content missing</span>}
                                        </p>
                                        <span className={`text-[9px] block ${isMe ? 'opacity-70' : "opacity-40"}`}
                                        >
                                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString([], {hour: "2-digit", minute: '2-digit'}) : "just now"}
                                        </span>

                                    </div>
                                </div>
                                )
                            })}
                            
                        </div>

                        {/*footer content */}
                        <footer className='p-4 border-t bg-background shrink-0 flex gap-2'>
                            <Input
                            className='flex-1 rounded-xl bg-muted/40 border-none h-11'
                            placeholder={`Message ${getOtherParticipant(activeThread).name}...`}
                            value ={text}
                            onChange = {(e)=> setText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            >
                            </Input>
                            <Button
                            onClick={sendMessage}
                            size='icon'
                            >
                                <Send className='h-4 w-4'/>
                            </Button>
                        </footer>
                    </>
                ) :(
                    <div className='flex-1 flex flex-col items-center justify-center text-center'>
                        <div className='w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center'>
                            <Search className='h-10 w-10'/>
                        </div>
                        <h2 className='text-xl'>Your Marketplace Inbox</h2>
                        <p className='text-muted-foreground max-w-xs text-sm'>
                            Select a Chat to view messages or start new conversations
                        </p>
                    </div>
                )}

            </div>
        </div>
    )
}

