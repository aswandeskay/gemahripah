// src/app/page.tsx

import { KpiCard } from "@/components/kpi-card";
import { DashboardNav } from "@/components/dashboard-nav";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Data untuk grafik (bisa nanti diambil dari API)
const salesData = [
  { name: 'Sen', omzet: 1200000 },
  { name: 'Sel', omzet: 1500000 },
  { name: 'Rab', omzet: 900000 },
  { name: 'Kam', omzet: 1800000 },
  { name: 'Jum', omzet: 2100000 },
  { name: 'Sab', omzet: 2500000 },
  { name: 'Min', omzet: 1900000 },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Navigasi utama */}
      <DashboardNav />
      
      {/* Kartu KPI (Key Performance Indicator) */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Omzet Hari Ini" value="Rp 1.900.000" icon={DollarSign} description="+20% dari kemarin" />
        <KpiCard title="Order Hari Ini" value="25" icon={ShoppingCart} description="+5 dari kemarin" />
        <KpiCard title="Stok Menipis" value="3 Item" icon={Package} description="Perlu segera diisi" />
        <KpiCard title="Profit Estimasi" value="Rp 950.000" icon={TrendingUp} description="50% margin" />
      </section>

      {/* Grafik Trend Penjualan */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Trend Penjualan 7 Hari Terakhir</h2>
        <Card>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Line type="monotone" dataKey="omzet" stroke="#1A4D2E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
