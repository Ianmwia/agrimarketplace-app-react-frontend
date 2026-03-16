import { useState, useEffect } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';


export default function ReportForm(){

    const [officers, setOfficers] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [assignedTo, setAssignedTo] = useState('')

    useEffect(()=>{
        const fetchOfficers = async () => {

        try {
            const res = await API.get('produce/')
            const data = res.data.officers || []
            setOfficers(data)
            
        } catch {
            toast.error('Could Not load Officers List')
        }    
    }
        fetchOfficers();
    }, [])
    
    const createReport = async (e) => {
        e.preventDefault()

        if (!title || !description || !assignedTo){
            toast.error('Please fill in the fields')
            return
        }

        try {
            await API.post('report/', {
                title: title,
                description: description,
                assigned_to: assignedTo

            })
            toast.success('Report Submitted')
            
        } catch {
            toast.error('failed to create report')
        }    
    }


    return(
        <div className='max-w-3xl mx-auto space-y-6'>
            <div>
                <h2 className='tex-2xl font-bold tracking-tight'>Contact Field Officer</h2>
                <p className='text-muted-foreground text-sm mt-1'>Submit A report Request and a Filed Officer Will Assist You</p>
            </div>

            <Separator/>
           

            <form action="" encType='multipart/form-data' onSubmit={createReport} className='space-y-5 bg-muted/30 p-6 rounded-xl  border border-border'>
                <Label>Title</Label>
                <Input name='title' type='text' placeholder='Title' onChange={(e)=> setTitle(e.target.value)} required/>
                
                 <Label>Field Officer</Label>
                <Select key={officers.length} onValueChange={setAssignedTo} value={assignedTo}>
                    <SelectTrigger>
                        <SelectValue placeholder='Select Field Officer'/>
                    </SelectTrigger>
                    <SelectContent>
                        {officers.map((officer)=> (
                            <SelectItem
                            key={officer.id}
                            value={officer.id.toString()}
                            >
                                Name {officer.first_name} {officer.last_name} Service provided {officer.field}</SelectItem>
                        ))}

                    </SelectContent>
                </Select>
                 <Label>Description</Label>
                <Textarea placeholder='Describe Your Message' onChange={(e)=> setDescription(e.target.value)}/>

                <div className='md:cols-span-2 mt-5'>
                    <Button className='w-full'>
                        Submit report
                    </Button>
                </div>
            </form>
    

        </div>
    )
}