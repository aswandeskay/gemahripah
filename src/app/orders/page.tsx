"use client";

import { useState, FormEvent } from "react";

type SalesChannel = "online" | "offline";

type SubChannel =
  | "post_sosmed"
  | "ads_sosmed"
  | "grabfood"
  | "shopeefood"
  | "direct"
  | "reseller"
  | "referral";

type ProductId = "BROTO" | "DEWI_SRI" | "GENDIS" | "LOJINAWI" | "WIDURI";
type ProductSize = "S" | "L"; // S: 260ml, L: 1L

type Product = {
  id: ProductId;
  name: string;
  basePriceSmall: number; // harga untuk 260ml
};

type FreeBonus = {
  productId: ProductId;
  productName: string;
  size: ProductSize;
  qty: number;
};

type Order = {
  id: number;
  date: string;
  productId: ProductId;
  productName: string;
  size: ProductSize;
  qty: number;
  unitPrice: number;
  channel: SalesChannel;
  subChannel: SubChannel;
  resellerName?: string;
  buyerName?: string;
  isFreeProduct: boolean; // order full free (tanpa uang masuk)
  shippingSubsidy: number; // subsidi ongkir (expense)
  freeBonus?: FreeBonus | null; // bonus free utk reseller/referral
};

const products: Product[] = [
  { id: "BROTO", name: "Broto", basePriceSmall: 12000 },
  { id: "DEWI_SRI", name: "Dewi Sri", basePriceSmall: 20000 },
  { id: "GENDIS", name: "Gendis", basePriceSmall: 18000 },
  { id: "LOJINAWI", name: "Lojinawi", basePriceSmall: 15000 },
  { id: "WIDURI", name: "Widuri", basePriceSmall: 15000 },
];

const subChannelLabel: Record<SubChannel, string> = {
  post_sosmed: "Posting Sosial Media",
  ads_sosmed: "Iklan Sosial Media",
  grabfood: "GrabFood",
  shopeefood: "ShopeeFood",
  direct: "Direct (walk-in / teman)",
  reseller: "Reseller",
  referral: "Referral",
};

const onlineSubChannels: SubChannel[] = [
  "post_sosmed",
  "ads_sosmed",
  "grabfood",
  "shopeefood",
];

const offlineSubChannels: SubChannel[] = ["direct", "reseller", "referral"];

function getProduct(productId: ProductId): Product {
  const found = products.find((p) => p.id === productId);
  if (!found) throw new Error(`Produk ${productId} tidak ditemukan`);
  return found;
}

function getUnitPrice(productId: ProductId, size: ProductSize): number {
  const product = getProduct(productId);
  const base = product.basePriceSmall;
  return size === "S" ? base : base * 4; // 1L = 4x 260ml
}

function formatCurrency(value: number): string {
  return value.toLocaleString("id-ID");
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [form, setForm] = useState(() => {
    const today = new Date().toISOString().slice(0, 10);
    const defaultProduct: ProductId = "BROTO";
    const defaultSize: ProductSize = "S";
    return {
      date: today,
      productId: defaultProduct,
      size: defaultSize,
      qty: 1,
      unitPrice: getUnitPrice(defaultProduct, defaultSize),
      channel: "online" as SalesChannel,
      subChannel: "post_sosmed" as SubChannel,
      resellerName: "",
      buyerName: "",
      isFreeProduct: false,
      shippingSubsidy: 0,
      hasFreeBonus: false,
      freeBonusProductId: defaultProduct as ProductId,
      freeBonusSize: "S" as ProductSize,
      freeBonusQty: 1,
    };
  });

  function handleChange(
    field: keyof typeof form,
    value: string | number | boolean
  ) {
    setForm((prev) => {
      let next = { ...prev, [field]: value } as typeof form;

      // Channel berubah -> sesuaikan subChannel
      if (field === "channel") {
        const ch = value as SalesChannel;
        const allowed =
          ch === "online" ? onlineSubChannels : offlineSubChannels;
        if (!allowed.includes(next.subChannel)) {
          next.subChannel = allowed[0];
        }
      }

      // Sub-channel berubah -> reset bonus kalau gak relevan
      if (field === "subChannel") {
        const sc = value as SubChannel;
        if (sc !== "reseller" && sc !== "referral") {
          next.hasFreeBonus = false;
        }
      }

      // Ganti produk / size -> update harga (kalau bukan full free)
      if (!next.isFreeProduct && (field === "productId" || field === "size")) {
        const productId =
          (field === "productId" ? value : next.productId) as ProductId;
        const size = (field === "size" ? value : next.size) as ProductSize;
        next.unitPrice = getUnitPrice(productId, size);
      }

      // Toggle full free product
      if (field === "isFreeProduct") {
        const checked = value as boolean;
        if (checked) {
          next.unitPrice = 0;
        } else {
          next.unitPrice = getUnitPrice(
            next.productId as ProductId,
            next.size as ProductSize
          );
        }
      }

      if (field === "shippingSubsidy") {
        const num = Number(value);
        next.shippingSubsidy = Number.isNaN(num) ? 0 : num;
      }

      if (field === "freeBonusQty") {
        const num = Number(value);
        next.freeBonusQty = Number.isNaN(num) || num < 1 ? 1 : num;
      }

      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const product = getProduct(form.productId as ProductId);

    let freeBonus: FreeBonus | null = null;
    if (
      form.hasFreeBonus &&
      (form.subChannel === "reseller" || form.subChannel === "referral")
    ) {
      const fbProduct = getProduct(form.freeBonusProductId as ProductId);
      freeBonus = {
        productId: fbProduct.id,
        productName: fbProduct.name,
        size: form.freeBonusSize as ProductSize,
        qty: Number(form.freeBonusQty),
      };
    }

    const newOrder: Order = {
      id: Date.now(),
      date: form.date,
      productId: form.productId as ProductId,
      productName: product.name,
      size: form.size as ProductSize,
      qty: Number(form.qty),
      unitPrice: form.isFreeProduct ? 0 : Number(form.unitPrice),
      channel: form.channel,
      subChannel: form.subChannel,
      resellerName:
        form.subChannel === "reseller" || form.subChannel === "referral"
          ? form.resellerName.trim()
          : undefined,
      buyerName: form.buyerName.trim() || undefined,
      isFreeProduct: form.isFreeProduct,
      shippingSubsidy: Number(form.shippingSubsidy) || 0,
      freeBonus,
    };

    setOrders((prev) => [newOrder, ...prev]);

    setForm((prev) => ({
      ...prev,
      qty: 1,
      unitPrice: getUnitPrice(
        prev.productId as ProductId,
        prev.size as ProductSize
      ),
      buyerName: "",
      resellerName: "",
      isFreeProduct: false,
      shippingSubsidy: 0,
      hasFreeBonus: false,
      freeBonusQty: 1,
    }));
  }

  const totalRevenue = orders.reduce((sum, o) => {
    const base = o.qty * o.unitPrice;
    const effective = o.isFreeProduct ? 0 : base;
    return sum + effective;
  }, 0);

  const totalShippingSubsidy = orders.reduce(
    (sum, o) => sum + o.shippingSubsidy,
    0
  );

  const netRevenueAfterExpenses = totalRevenue - totalShippingSubsidy;
  const totalOrders = orders.length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #e0f2fe 0, transparent 45%), radial-gradient(circle at top right, #fce7f3 0, transparent 45%), #f3f4f6",
        padding: "24px 12px 40px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
        {/* HEADER */}
        <header style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Gemahripah – Pencatatan Order
              </h1>
              <p
                style={{
                  marginTop: "6px",
                  marginBottom: 0,
                  fontSize: "13px",
                  color: "#6b7280",
                  maxWidth: "520px",
                }}
              >
                Catat seluruh penjualan, free product, dan subsidi ongkir di
                satu tempat. Data ini nanti akan terhubung ke stok dan
                pembukuan.
              </p>
            </div>

            <div
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                background: "rgba(15,23,42,0.06)",
                fontSize: "11px",
                color: "#111827",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background:
                    totalOrders > 0 ? "#22c55e" : "rgba(148,163,184,0.9)",
                }}
              />
              <span>
                Status:{" "}
                <strong>
                  {totalOrders > 0 ? "Aktif mencatat order" : "Belum ada order"}
                </strong>
              </span>
            </div>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "14px",
              background: "#0f172a",
              color: "white",
              boxShadow: "0 16px 40px rgba(15,23,42,0.45)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                opacity: 0.8,
              }}
            >
              Omzet (setelah free)
            </div>
            <div style={{ marginTop: "4px", fontSize: "20px", fontWeight: 700 }}>
              Rp {formatCurrency(totalRevenue)}
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "14px",
              background: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
              }}
            >
              Subsidi Ongkir
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#b91c1c",
              }}
            >
              Rp {formatCurrency(totalShippingSubsidy)}
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "14px",
              background: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
              }}
            >
              Omzet Bersih
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#15803d",
              }}
            >
              Rp{" "}
              {formatCurrency(
                netRevenueAfterExpenses > 0 ? netRevenueAfterExpenses : 0
              )}
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "14px",
              background: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "#6b7280",
              }}
            >
              Jumlah Order
            </div>
            <div
              style={{
                marginTop: "4px",
                fontSize: "18px",
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              {totalOrders} transaksi
            </div>
          </div>
        </section>

        {/* GRID: FORM + TABLE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            style={{
              borderRadius: "18px",
              background: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 18px 45px rgba(15,23,42,0.08)",
              padding: "18px 18px 20px",
            }}
          >
            {/* ... FORM SECTION SAMA PERSIS DENGAN VERSI SEBELUMNYA ... */}
            {/* Demi singkat, bagian ini sudah kamu punya dari kode sebelumnya.
                Kalau kamu mau, aku bisa kirim ulang satu file utuh lagi di chat berikutnya. */}
          </form>

          {/* TABEL ORDER */}
          {/* ... bagian tabel sama seperti versi sebelumnya ... */}
        </div>
      </div>
    </main>
  );
}
