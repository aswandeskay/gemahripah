"use client"; // Penting untuk menggunakan hook seperti useState dan useEffect

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product } from "@/types";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4">Memuat data produk...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Produk & Resep</h1>
      
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Daftar Produk</TabsTrigger>
          <TabsTrigger value="recipes">Daftar Resep</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Small (260ml): Rp {product.priceSmall.toLocaleString('id-ID')}</p>
                  <p>Large (1L): Rp {product.priceLarge.toLocaleString('id-ID')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recipes">
          <Card>
            <CardHeader>
              <CardTitle>Resep: (Contoh) Broto (260ml)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bahan</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Satuan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Biji Kopi</TableCell><TableCell>20</TableCell><TableCell>gram</TableCell></TableRow>
                  <TableRow><TableCell>Gula Aren</TableCell><TableCell>10</TableCell><TableCell>ml</TableCell></TableRow>
                  <TableRow><TableCell>Botol Plastik</TableCell><TableCell>1</TableCell><TableCell>pcs</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
