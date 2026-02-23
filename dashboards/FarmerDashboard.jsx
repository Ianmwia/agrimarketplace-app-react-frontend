import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import ProduceForm from './farmerspages/ProduceForm'
// import ProduceList from ''
// import OrdersList from ''
// import ReportForm from ''
import { useState } from 'react';

export default function FarmerDashboardNew(){
    const [tab, setTab] = useState('produce')

    return(
        <div className='container mx-aut0 px-4 py-6 md:py-10 max-w-7xl'>

            {/*tabs */}
            <div className=' flex justify-center gap-4 mb-10 flex-wrap'>
                <Button
                onClick={()=> setTab('produce')}
                className={`px-6 font-bold ${tab === "produce"
                    }`}
                >
                    My Produce
                </Button>
                <Button
                onClick={()=> setTab('produce')}
                className={`px-6 font-bold ${tab === "produce"
                    }`}
                >
                    Orders
                </Button>
                <Button
                onClick={()=> setTab('produce')}
                className={`px-6 font-bold ${tab === "produce"
                    }`}
                >
                    File A report
                </Button>
                
                {/*produce tab */}
                {tab === 'produce' && (
                    <div className='space-y-10'>
                        <ProduceForm/>
                        {/* <ProduceList/> */}
                    </div>
                )}

                {/*orders tab */}
                {tab === 'orders' && <OrdersList/>}
                {/*report tab */}
                {tab === 'report' && <ReportForm/>}

            </div>
        </div>
    )
}