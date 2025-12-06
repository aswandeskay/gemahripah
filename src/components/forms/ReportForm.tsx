import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { DatePicker } from '@/components/ui/DatePicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { format, subDays, subMonths } from 'date-fns'

// Sample sales data
const salesData = [
  { date: '2023-01-01', total: 1500000, cost: 800000, channel: 'online', subChannel: 'grabfood' },
  { date: '2023-01-02', total: 1200000, cost: 650000, channel: 'offline', subChannel: 'direct' },
  { date: '2023-01-03', total: 1800000, cost: 950000, channel: 'online', subChannel: 'shopeefood' },
  { date: '2023-01-04', total: 2000000, cost: 1100000, channel: 'online', subChannel: 'gofood' },
  { date: '2023-01-05', total: 1700000, cost: 900000, channel: 'offline', subChannel: 'reseller' },
  { date: '2023-01-06', total: 1600000, cost: 850000, channel: 'online', subChannel: 'socmed-ads' },
  { date: '2023-01-07', total: 2100000, cost: 1150000, channel: 'offline', subChannel: 'referral' },
]

// Sample purchase data
const purchaseData = [
  { date: '2023-01-01', total: 500000, supplier: 'PT. Food Ingredient Indonesia' },
  { date: '2023-01-03', total: 750000, supplier: 'CV. Berkah Jaya' },
  { date: '2023-01-05', total: 600000, supplier: 'UD. Sumber Makmur' },
  { date: '2023-01-07', total: 800000, supplier: 'PT. Food Ingredient Indonesia' },
]

// Sample commission data
const commissionData = [
  { name: 'Reseller A', amount: 150000, type: 'reseller' },
  { name: 'Reseller B', amount: 225000, type: 'reseller' },
  { name: 'Referral A', amount: 75000, type: 'referral' },
  { name: 'Referral B', amount: 105000, type: 'referral' },
]

// Sample free product data
const freeProductData = [
  { date: '2023-01-02', cost: 80000, reason: 'Promotion' },
  { date: '2023-01-04', cost: 120000, reason: 'Sample' },
  { date: '2023-01-06', cost: 100000, reason: 'Gift' },
]

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function ReportForm() {
  const [reportPeriod, setReportPeriod] = useState('weekly')
  const [startDate, setStartDate] = useState(subDays(new Date(), 7))
  const [endDate, setEndDate] = useState(new Date())
  const [reportType, setReportType] = useState('sales')

  // Calculate total revenue, cost, and profit
  const totalRevenue = salesData.reduce((sum, item) => sum + item.total, 0)
  const totalCost = salesData.reduce((sum, item) => sum + item.cost, 0)
  const totalProfit = totalRevenue - totalCost
  const totalPurchase = purchaseData.reduce((sum, item) => sum + item.total, 0)
  const totalCommission = commissionData.reduce((sum, item) => sum + item.amount, 0)
  const totalFreeProductCost = freeProductData.reduce((sum, item) => sum + item.cost, 0)

  // Group sales by channel
  const salesByChannel = salesData.reduce((acc, item) => {
    const channel = item.channel === 'online' ? 'Online' : 'Offline'
    const existing = acc.find(c => c.name === channel)
    if (existing) {
      existing.value += item.total
    } else {
      acc.push({ name: channel, value: item.total })
    }
    return acc
  }, [] as { name: string, value: number }[])

  // Group sales by sub-channel
  const salesBySubChannel = salesData.reduce((acc, item) => {
    const subChannel = item.subChannel
    const existing = acc.find(c => c.name === subChannel)
    if (existing) {
      existing.value += item.total
    } else {
      acc.push({ name: subChannel, value: item.total })
    }
    return acc
  }, [] as { name: string, value: number }[])

  // Format data for daily sales chart
  const dailySalesData = salesData.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    revenue: item.total,
    cost: item.cost,
    profit: item.total - item.cost
  }))

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="purchase">Purchase</TabsTrigger>
        <TabsTrigger value="profit-loss">Profit & Loss</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {salesData.length} transactions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {totalCost.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Cost of goods sold
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Gross Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {totalProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {((totalProfit / totalRevenue) * 100).toFixed(1)}% margin
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesData.length}</div>
              <p className="text-xs text-muted-foreground">
                In the selected period
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByChannel}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesByChannel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sales by Sub-Channel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesBySubChannel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="sales" className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="period" className="text-sm font-medium">
              Period:
            </label>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {reportPeriod === 'custom' && (
            <>
              <div className="flex items-center space-x-2">
                <label htmlFor="start-date" className="text-sm font-medium">
                  From:
                </label>
                <DatePicker
                  value={startDate}
                  onChange={setStartDate}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="end-date" className="text-sm font-medium">
                  To:
                </label>
                <DatePicker
                  value={endDate}
                  onChange={setEndDate}
                />
              </div>
            </>
          )}
          
          <Button>Generate Report</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Revenue, cost, and profit per day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Bar dataKey="cost" fill="#82ca9d" name="Cost" />
                <Bar dataKey="profit" fill="#ffc658" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Transactions</CardTitle>
            <CardDescription>List of all sales transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Channel</th>
                    <th className="text-left p-2">Sub-Channel</th>
                    <th className="text-right p-2">Revenue</th>
                    <th className="text-right p-2">Cost</th>
                    <th className="text-right p-2">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {salesData.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{format(new Date(item.date), 'dd MMM yyyy')}</td>
                      <td className="p-2">{item.channel === 'online' ? 'Online' : 'Offline'}</td>
                      <td className="p-2">{item.subChannel}</td>
                      <td className="p-2 text-right">Rp {item.total.toLocaleString()}</td>
