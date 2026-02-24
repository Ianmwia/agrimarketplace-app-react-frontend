import { useState } from 'react';
import API from '@/api';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ViewReport(){
    const [report, setReport] = useState([])

    const fetchReport = async () => {
        
        try {
            await async.API.get('report/')
        } catch (error) {
            toast.error('Error fetching reports')
        }
    }

    return(
        <div>
            <div>
                <h2 className='tex-2xl font-bold tracking-tight'>Reports</h2>
                <p className='text-muted-foreground text-sm mt-1'>Reports created by Farmers</p>
            </div>

            <Separator/>

            <div className='grid grid-cols-1'>
            {report.map((report)=>(

            
            <Card key={report.id}>
                <CardHeader>
                    <CardTitle>Report</CardTitle>
                </CardHeader>

                <CardContent className='p-5'>
                    <div>Report Filed By: {report.first_name}</div>

                </CardContent>
            </Card>
            ))}
            </div>

        </div>
    )
}