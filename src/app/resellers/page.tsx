"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Reseller } from "@/types";
import { Plus } from "lucide-react";

export default function ResellersPage() {
  const [resellers, setResellers] = useState<Reseller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReseller, setNewReseller] = useState<Partial<Reseller>>({ scheme: 'commission' });

  useEffect(() => {
    const fetchResellers = async () => {
      const response = await fetch('/api/resellers');
      const data = await response.json();
      setResellers(data);
      setIsLoading(false);
    };
    fetchResellers();
  }, []);

  const handleAddReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReseller.name || !newReseller.scheme) return;

    await fetch('/api/resellers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReseller),
    });

    // Reset form dan refresh data
    setNewReseller({ scheme: 'commission' });
    const response = await fetch('/api/resellers');
    const data = await response.json();
    setResellers(data);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Memuat data reseller...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Manajemen Agen</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Tambah Reseller Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddReseller} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="name">Nama Reseller</Label>
              <Input id="name" value={newReseller.name || ''} onChange={(e) => setNewReseller({ ...newReseller, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="scheme">Skema</Label>
              <Select value={newReseller.scheme} onValueChange={(value: 'commission' | 'free_product') => setNewReseller({ ...newReseller, scheme: value, commissionPercent: value === 'commission' ? 10 : 0 })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commission">Berdasarkan Komisi</SelectItem>
                  <SelectItem value="free_product">Berdasarkan Produk Gratis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newReseller.scheme === 'commission' && (
              <div>
                <Label htmlFor="commission">Komisi (%)</Label>
                <Input id="commission" type="number" value={newReseller.commissionPercent || ''} onChange={(e) => setNewReseller({ ...newReseller, commissionPercent: parseInt(e.target.value) })} required />
              </div>
            )}
            <Button type="submit" className="self-end">
              <Plus className="mr-2 h-4 w-4" /> Tambah
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Reseller & Referral</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Skema</TableHead>
                <TableHead>Komisi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resellers.map(reseller => (
                <TableRow key={reseller.id}>
                  <TableCell className="font-medium">{reseller.name}</TableCell>
                  <TableCell>{reseller.scheme === 'commission' ? 'Komisi' : 'Produk Gratis'}</TableCell>
                  <TableCell>{reseller.commissionPercent}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
