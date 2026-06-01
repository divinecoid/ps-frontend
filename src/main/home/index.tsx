import { useEffect, useState } from "react";
import Services from "@/services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Timer, Package, ShoppingBag, Clock, CheckCircle, Truck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
    const [period, setPeriod] = useState<string>("today");
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>({
        from: new Date(),
        to: new Date()
    });
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            let start = undefined;
            let end = undefined;
            
            if (period === "custom" && dateRange?.from && dateRange?.to) {
                start = format(dateRange.from, "yyyy-MM-dd");
                end = format(dateRange.to, "yyyy-MM-dd");
            }
            
            const response = await Services.Dashboard.getStats(period, start, end);
            if (response.ok) {
                const json = await response.json();
                if (json.success) {
                    setStats(json.data);
                }
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (period === "custom") {
            if (dateRange?.from && dateRange?.to) {
                fetchStats();
            }
        } else {
            fetchStats();
        }
    }, [period, dateRange]);

    return (
        <div className="flex-1 space-y-6 p-8 pt-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 font-sans">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">Dashboard</h2>
                
                <div className="flex items-center space-x-3">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm rounded-lg">
                            <SelectValue placeholder="Pilih Periode" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                            <SelectItem value="today">Hari ini</SelectItem>
                            <SelectItem value="this_week">Minggu ini</SelectItem>
                            <SelectItem value="this_month">Bulan ini</SelectItem>
                            <SelectItem value="custom">Custom Tanggal</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    {period === "custom" && (
                        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-[260px] justify-start text-left font-normal bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 shadow-sm rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800",
                                        !dateRange && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-zinc-400" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (
                                            <>
                                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                                {format(dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-md rounded-xl" align="end">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={dateRange?.from}
                                    selected={{
                                        from: dateRange?.from,
                                        to: dateRange?.to,
                                    }}
                                    onSelect={(range) => {
                                        setDateRange(range as any);
                                        if (range?.from && range?.to) {
                                            setIsDatePickerOpen(false);
                                        }
                                    }}
                                    numberOfMonths={2}
                                    className="text-zinc-800 dark:text-zinc-200"
                                />
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>

            {loading && !stats ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-400 dark:border-zinc-600"></div>
                </div>
            ) : stats ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">Rata-rata Waktu</CardTitle>
                                <Timer className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{stats.avgPreparationTime} <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500">mnt</span></div>
                                <div className="flex items-center mt-2 text-xs">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md">
                                        <ArrowDownRight className="w-3 h-3 mr-0.5" /> Efisien
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">Paket Disiapkan</CardTitle>
                                <Package className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{stats.totalPackages}</div>
                                <div className="flex items-center mt-2 text-xs">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md">
                                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> Selesai
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">Barang Disiapkan</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{stats.totalItems}</div>
                                <div className="flex items-center mt-2 text-xs text-zinc-400">
                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md mr-1.5">
                                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> Diproses
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">Order Pending</CardTitle>
                                <Clock className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{stats.pendingOrders}</div>
                                <div className="flex items-center mt-2 text-xs text-zinc-400">
                                    <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md mr-1.5">
                                        <ArrowUpRight className="w-3 h-3 mr-0.5" /> Aktif
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4 bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="pb-8">
                                <CardTitle className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">Tren Paket Disiapkan</CardTitle>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Total pencapaian harian berdasarkan periode ini</div>
                            </CardHeader>
                            <CardContent className="pl-0 pr-4">
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats.weeklyData}>
                                            <CartesianGrid stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/60" strokeDasharray="3 3" vertical={false} />
                                            <XAxis 
                                                dataKey="day" 
                                                stroke="#a1a1aa" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                stroke="#a1a1aa" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                tickFormatter={(value) => `${value}`} 
                                                dx={-10}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    borderColor: 'hsl(var(--border))',
                                                    borderRadius: '8px',
                                                    color: 'hsl(var(--card-foreground))',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                                itemStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 600 }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="packages" 
                                                stroke="currentColor" 
                                                className="text-zinc-900 dark:text-zinc-100"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{ r: 5, fill: 'currentColor', strokeWidth: 0 }} 
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card className="col-span-3 bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="pb-8">
                                <CardTitle className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100">Perbandingan Barang</CardTitle>
                                <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Item yang selesai diproses harian</div>
                            </CardHeader>
                            <CardContent className="pl-0 pr-4">
                                <div className="h-[320px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.weeklyData}>
                                            <CartesianGrid stroke="currentColor" className="text-zinc-100 dark:text-zinc-800/60" strokeDasharray="3 3" vertical={false} />
                                            <XAxis 
                                                dataKey="day" 
                                                stroke="#a1a1aa" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                dy={10}
                                            />
                                            <YAxis 
                                                stroke="#a1a1aa" 
                                                fontSize={12} 
                                                tickLine={false} 
                                                axisLine={false} 
                                                dx={-10}
                                            />
                                            <Tooltip 
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    borderColor: 'hsl(var(--border))',
                                                    borderRadius: '8px',
                                                    color: 'hsl(var(--card-foreground))',
                                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                }}
                                                itemStyle={{ color: 'hsl(var(--card-foreground))', fontWeight: 600 }}
                                                cursor={{ fill: 'currentColor', className: 'text-zinc-100/50 dark:text-zinc-800/20' }}
                                            />
                                            <Bar dataKey="items" fill="currentColor" className="text-zinc-400 dark:text-zinc-500" radius={[2, 2, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                    <CheckCircle className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">Paket Selesai Hari Ini</CardTitle>
                                    <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{stats.todayPackages}</div>
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] rounded-2xl">
                            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                                    <Truck className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                                </div>
                                <div>
                                    <CardTitle className="text-[13px] font-semibold text-zinc-500 dark:text-zinc-400">Barang Diproses Hari Ini</CardTitle>
                                    <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">{stats.todayItems}</div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            ) : null}
        </div>
    );
}