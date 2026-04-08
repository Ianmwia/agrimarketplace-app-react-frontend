import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import ProduceForm from './farmerspages/ProduceForm'
import ProduceList from './farmerspages/ProduceList'
import OrdersList from './farmerspages/OrdersList'
import ReportForm from './farmerspages/ReportForm'
import FarmerViewReport from './farmerspages/FarmerViewReports';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function FarmerDashboard(){
    const location = useLocation()
    
    const [tab, setTab] = useState(location.state?.activeTab || 'produce')
    const [version, setVersion] = useState(0)
    const refresh = () => {
        setVersion(prev => prev + 1)
        setTab('produce-list')
    }

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-background">
                {/* sidebar on lg only */}
            <aside className="w-full lg:w-72 lg:fixed lg:h-screen border-b lg:border-b-0 lg:border-r lg:bg-card z-40">
                <div className="p-4 lg:p-8 grid grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col flex-row flex-wrap gap-2 lg:overflow-x-visible no-scrollbar">
                    <div className="hidden lg:block mb-8 px-2">
                        <h2 className="text-2xl font-black tracking-tighter text-primary">KILIMO</h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Farmer Portal</p>
                    </div>

                    <Button
                        onClick={() => setTab('produce')}
                        variant={tab === 'produce' ? 'default' : 'ghost'}
                        className={`px-6 justify-start rounded-xl font-bold h-12 lg:flex-none lg:w-full
                            ${
                            tab === "produce" ? "shadow-md" : ""
                        }`}
                    >
                        Create Produce
                    </Button>

                    <Button
                        onClick={() => setTab('produce-list')}
                        variant={tab === 'produce-list' ? 'default' : 'ghost'}
                        className={`px-6 justify-start rounded-xl font-bold h-12 flex-none lg:w-full whitespace-nowrap ${
                            tab === "produce-list" ? "shadow-md" : ""
                        }`}
                    >
                        View Your Produce
                    </Button>

                    <Button
                        onClick={() => setTab('orders')}
                        variant={tab === 'orders' ? 'default' : 'ghost'}
                        className={`px-6 justify-start rounded-xl font-bold h-12 flex-none lg:w-full whitespace-nowrap ${
                            tab === "orders" ? "shadow-md" : ""
                        }`}
                    >
                        Orders
                    </Button>

                    <Button
                        onClick={() => setTab('report')}
                        variant={tab === 'report' ? 'default' : 'ghost'}
                        className={`px-6 justify-start rounded-xl font-bold h-12 flex-none lg:w-full whitespace-nowrap ${
                            tab === "report" ? "shadow-md" : ""
                        }`}
                    >
                        File A report
                    </Button>

                    <Button
                        onClick={() => setTab('report-created')}
                        variant={tab === 'report-created' ? 'default' : 'ghost'}
                        className={`px-6 justify-start rounded-xl font-bold h-12 flex-none lg:w-full whitespace-nowrap ${
                            tab === "report-created" ? "shadow-md" : ""
                        }`}
                    >
                        View Reports Created
                    </Button>

                    <Button
                        asChild
                        variant='ghost'
                        className='hidden lg:flex px-6 justify-start rounded-xl font-bold h-12 flex-none lg:w-full'

                    >
                        <Link
                            to="/thread"
                                className=""
                              >
                                <span>Chat</span>
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* main content */}
            <main className="flex-1 lg:ml-72 flex flex-col h-screen overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-5xl mx-auto">
                        
                        <div className="mb-6 lg:mb-10">
                            <h1 className="text-3xl font-bold tracking-tight capitalize">
                                {tab.replace('-', ' ')}
                            </h1>
                        </div>

                        {/* tabs */}
                        <div className="">
                            {tab === 'produce' && (
                                <div className="space-y-10">
                                    <ProduceForm onSuccess={refresh} />
                                </div>
                            )}
                            {tab === 'produce-list' && (
                                <div className="space-y-10">
                                    <ProduceList key={version} />
                                </div>
                            )}

                            {tab === 'orders' && <OrdersList />}
                            {tab === 'report' && <ReportForm />}
                            {tab === 'report-created' && <FarmerViewReport />}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}