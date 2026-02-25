import { useState, useEffect } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User, ClipboardList, Clipboard } from 'lucide-react';

export default function FarmerViewReport(){
    const [reports, setReports] = useState([])

    const fetchReport = async () => {
        
        try {
            const res = await API.get('report/')
            setReports(res.data.reports || [])
        } catch (error) {
            toast.error('Error fetching reports')
        }
    }

    useEffect(()=>{
        fetchReport()
    }, [])

    return(
        <div className='bg-background p-4 md:p-8 lg:p-12'>
        <div className='max-w-3xl mx-auto space-y-5'>
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='space-y-1'>
                <h2 className='text-3xl font-extrabold tracking-tight md:text-4xl'>Reports</h2>
                <p className='text-muted-foreground text-base'>Reports created by Farmers for Assessment</p>
                <Badge variant='secondary' className={`w-fit h-fit px-3 py-1 text-sm font-medium`}>
                    {reports.length} Active Reports
                </Badge>
            </div>
            </div>

            <Separator className={`opacity-50`}/>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {reports.length > 0 ? (
                reports.map((item, index) => (

            
            <Card key={item.id || index}>
                <CardHeader>
                    <CardTitle><span className='text-2xl'><Label>Title</Label></span>{item.title}</CardTitle>
                </CardHeader>
                <Separator/>
                
                <CardContent className='p-5'>
                    <div className='text-sm mb-4'>
                        <p className='font-medium mb-3'>Description</p>
                        <p className='text-muted-foreground'> {item.description}</p>
                    </div>
                    <Separator className={`my-4`}/>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            <p className='font-semibold mb-3'>Report Filed On</p>
                            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <CalendarDays className='w-5 h-5'/>
                            <p>{new Date(item.created_at).toLocaleDateString(undefined, {dateStyle:'medium'})}</p>
                            </div>
                        </div>
                    </div>
                    <Separator className={`my-4`}/>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            
                            <p className='font-semibold mb-3'>Report Status</p>
                            <p>{item.status}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
                ))
            ): (
                <div className='col-span-full py-32 flex flex-col items-center justify-center border-2 rounded-2xl bg-muted/5'>
                    <p className='text-muted-foreground text-sm max-w-xs text-center'>You Do Not have Any Pending Reports To Review At This Time</p>
                </div>
            )}
            </div>

        </div>
        </div>
    )
}