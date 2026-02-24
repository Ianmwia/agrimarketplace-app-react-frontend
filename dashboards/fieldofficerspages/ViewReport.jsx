import { useState, useEffect } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

export default function ViewReport(){
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
        <div className='max-w-3xl mx-auto space-y-5'>
            <div>
                <h2 className='tex-2xl font-bold tracking-tight'>Reports</h2>
                <p className='text-muted-foreground text-sm mt-1'>Reports created by Farmers</p>
            </div>

            <Separator/>

            <div className='grid grid-cols-1 gap-4'>
            {reports.length > 0 ? (
                reports.map((item, index) => (

            
            <Card key={item.id || index}>
                <CardHeader>
                    <CardTitle><span className='text-2xl'><Label>Title</Label></span>{item.title}</CardTitle>
                </CardHeader>
                <Separator/>
                
                <CardContent className='p-5'>
                    <div className='text-sm mb-4'>
                        <p className='font-medium'>Description</p>
                        <p className='text-muted-foreground'> {item.description}</p>
                    </div>
                    <Separator className={`my-4`}/>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            <p className='font-semibold'>Report Filed On</p>
                            <p>{new Date(item.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Separator className={`my-4`}/>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            <p className='font-semibold'>Report Status</p>
                            <p>{item.status}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
                ))
            ): (
                <div className='text-center py-20 border-2 border-border'>
                    <p className='text-muted-foreground'> No Reports Currently Exist</p>
                </div>
            )}
            </div>

        </div>
    )
}