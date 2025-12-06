import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import OrderForm from '@/components/forms/OrderForm'
import PurchaseForm from '@/components/forms/PurchaseForm'
import StockOpnameForm from '@/components/forms/StockOpnameForm'
import ChannelForm from '@/components/forms/ChannelForm'
import ReportForm from '@/components/forms/ReportForm'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gemahripah Beverage Management</h1>
          <p className="text-lg text-gray-600">Sistem manajemen penjualan dan stok untuk bisnis minuman Anda</p>
        </div>
        
        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="order">Input Order</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Ingredients</TabsTrigger>
            <TabsTrigger value="stock">Stock Opname</TabsTrigger>
            <TabsTrigger value="channel">Channel & Reseller</TabsTrigger>
            <TabsTrigger value="report">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="order" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Input Order</CardTitle>
                <CardDescription>Masukkan data penjualan minuman</CardDescription>
              </CardHeader>
              <CardContent>
                <OrderForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="purchase" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Ingredients</CardTitle>
                <CardDescription>Record ingredient purchases and update stock</CardDescription>
              </CardHeader>
              <CardContent>
                <PurchaseForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Opname</CardTitle>
                <CardDescription>Check and adjust physical stock counts</CardDescription>
              </CardHeader>
              <CardContent>
                <StockOpnameForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="channel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Channel, Reseller & Referral Management</CardTitle>
                <CardDescription>Manage sales channels and reseller information</CardDescription>
              </CardHeader>
              <CardContent>
                <ChannelForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Profit/Loss</CardTitle>
                <CardDescription>View sales reports and profit analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ReportForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
