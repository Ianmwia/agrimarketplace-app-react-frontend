import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import ProduceForm from './farmerspages/ProduceForm'
import ProduceList from './farmerspages/ProduceList'
import OrdersList from './farmerspages/OrdersList'
import ReportForm from './farmerspages/ReportForm'
import { useState } from 'react';

export default function FarmerDashboard(){
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
                    Create Produce
                </Button>

                <Button
                onClick={()=> setTab('produce-list')}
                className={`px-6 font-bold ${tab === "produce-list"
                    }`}
                >
                    View Your Produce
                </Button>
                <Button
                onClick={()=> setTab('orders')}
                className={`px-6 font-bold ${tab === "orders"
                    }`}
                >
                    Orders
                </Button>
                <Button
                onClick={()=> setTab('report')}
                className={`px-6 font-bold ${tab === "report"
                    }`}
                >
                    File A report
                </Button>
            </div>

                {/*produce tab */}
            <div className='mt-5'>
                {tab === 'produce' && (
                    <div className='space-y-10'>
                        <ProduceForm/>
                    </div>
                )}
                {tab === 'produce-list' && (
                    <div className='space-y-10'>
                        <ProduceList/>
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