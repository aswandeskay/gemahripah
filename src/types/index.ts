export interface Product {
  id: string;
  name: string;
  priceSmall: number;
  priceLarge: number;
}

export interface Reseller {
  id: string;
  name: string;
  scheme: 'commission' | 'free_product';
  commissionPercent: number; // 0 jika scheme adalah free_product
  totalSales?: number; // Bisa dihitung dari order nantinya
}

// Tipe lain (Order, Ingredient, dll) tetap bisa dipertahankan
