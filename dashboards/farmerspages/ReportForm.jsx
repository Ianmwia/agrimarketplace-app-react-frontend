import { useState, useEffect } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ReportForm(){

    const [officers, setOfficers] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [assignedTo, setAssignedTo] = useState('')

    
    
    const createReport = async (e) => {
        e.preventDefault()

        if (!title || !description || !assignedTo){
            toast.error('Please fill in the fields')
            return
        }

        try {
            const res = await API.post('report/', {
                title: title,
                description: description,
                assigned_to: assignedTo

            })
            toast.success('Report Submitted')
            
        } catch (error) {
            toast.error('failed to create report')
        }    
    }


    return(
        <div>
            <form action="" encType='multipart/form-data' onSubmit={createReport} className='space-y-5'>
                <Input name='title' type='text' placeholder='title of message' onChange={(e)=> setTitle(e.target.value)} required/>
                
                <Select key={officers.length} onValueChange={setAssignedTo} value={assignedTo}>
                    <SelectTrigger>
                        <SelectValue placeholder='select field officer'/>
                    </SelectTrigger>
                    <SelectContent>
                        {officers.map((officer)=> (
                            <SelectItem
                            key={officer.id}
                            value={officer.id.toString()}
                            >{officer.first_name}</SelectItem>
                        ))}

                    </SelectContent>
                </Select>
                <Textarea placeholder='enter a description' onChange={(e)=> setDescription(e.target.value)}/>

                <div className='md:cols-span-2 mt-5'>
                    <Button className='w-full'>
                        Submit report
                    </Button>
                </div>
            </form>
    

        </div>
    )
}