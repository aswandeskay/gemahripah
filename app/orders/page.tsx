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
  isFreeProduct: boolean;
  shippingSubsidy: number; // subsidi ongkir (expense)
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

function getProduct(productId: ProductId): Product {
  const found = products.find((p) => p.id === productId);
  if (!found) {
    throw new Error(`Produk dengan ID ${productId} tidak ditemukan`);
  }
  return found;
}

function getUnitPrice(productId: ProductId, size: ProductSize): number {
  const product = getProduct(productId);
  const base = product.basePriceSmall;
  return size === "S" ? base : base * 4; // 1L = 4x 260ml
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
    };
  });

  function handleChange(
    field: keyof typeof form,
    value: string | number | boolean
  ) {
    setForm((prev) => {
      let next = { ...prev, [field]: value } as typeof form;

      // Kalau ganti produk atau size dan bukan free product, update harga otomatis
      if (
        !next.isFreeProduct &&
        (field === "productId" || field === "size")
      ) {
        const productId =
          (field === "productId" ? value : next.productId) as ProductId;
        const size = (field === "size" ? value : next.size) as ProductSize;
        next.unitPrice = getUnitPrice(productId, size);
      }

      // Kalau toggle free product
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

      // Normalisasi subsidi ongkir: kalau NaN → 0
      if (field === "shippingSubsidy") {
        const num = Number(value);
        next.shippingSubsidy = Number.isNaN(num) ? 0 : num;
      }

      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const product = getProduct(form.productId as ProductId);

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
    };

    setOrders((prev) => [newOrder, ...prev]);

    // reset beberapa field (produk & size tetap)
    setForm((prev) => ({
      ...prev,
      qty: 1,
      unitPrice: prev.isFreeProduct
        ? 0
        : getUnitPrice(prev.productId as ProductId, prev.size as ProductSize),
      buyerName: "",
      resellerName: "",
      isFreeProduct: false,
      shippingSubsidy: 0,
    }));
  }

  const totalRevenue = orders.reduce(
    (sum, o) => sum + o.qty * o.unitPrice,
    0
  );

  const totalShippingSubsidy = orders.reduce(
    (sum, o) => sum + o.shippingSubsidy,
    0
  );

  const netRevenueAfterSubsidy = totalRevenue - totalShippingSubsidy;

  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "960px",
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "4px" }}>Pencatatan Order</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Pilih produk & size, lalu catat order dari semua channel. Centang{" "}
        <b>Free Product</b> jika hanya keluar produk tanpa uang masuk (promo,
        tester, bonus). Subsidi ongkir juga bisa dicatat per transaksi sebagai
        expense.
      </p>

      {/* FORM ORDER */}
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #e2e2e2",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px 16px",
            marginBottom: "12px",
          }}
        >
          <label style={{ fontSize: "14px" }}>
            Tanggal
            <br />
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
              required
            />
          </label>

          <label style={{ fontSize: "14px" }}>
            Produk
            <br />
            <select
              value={form.productId}
              onChange={(e) =>
                handleChange("productId", e.target.value as ProductId)
              }
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Rp {p.basePriceSmall.toLocaleString("id-ID")} / 260ml)
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: "14px" }}>
            Size
            <br />
            <select
              value={form.size}
              onChange={(e) =>
                handleChange("size", e.target.value as ProductSize)
              }
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
            >
              <option value="S">Small (260ml)</option>
              <option value="L">Large (1L)</option>
            </select>
          </label>

          <label style={{ fontSize: "14px" }}>
            Jumlah (botol)
            <br />
            <input
              type="number"
              min={1}
              value={form.qty}
              onChange={(e) => handleChange("qty", Number(e.target.value))}
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
              required
            />
          </label>

          <label style={{ fontSize: "14px" }}>
            Harga per botol (Rp)
            <br />
            <input
              type="number"
              min={0}
              value={form.unitPrice}
              onChange={(e) =>
                handleChange("unitPrice", Number(e.target.value))
              }
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
              disabled={form.isFreeProduct}
              required
            />
            <span style={{ fontSize: "11px", color: "#777" }}>
              Otomatis dari produk & size, tapi boleh diubah untuk diskon.
            </span>
          </label>

          <label style={{ fontSize: "14px" }}>
            Subsidi Ongkir (Rp)
            <br />
            <input
              type="number"
              min={0}
              value={form.shippingSubsidy}
              onChange={(e) =>
                handleChange("shippingSubsidy", Number(e.target.value))
              }
              placeholder="Contoh: 2000 / 4000 / 5000"
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
            />
            <span style={{ fontSize: "11px", color: "#777" }}>
              Opsional. Dicatat sebagai expense di pembukuan.
            </span>
          </label>

          <label style={{ fontSize: "14px" }}>
            Channel
            <br />
            <select
              value={form.channel}
              onChange={(e) =>
                handleChange("channel", e.target.value as SalesChannel)
              }
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </label>

          <label style={{ fontSize: "14px" }}>
            Sub-channel
            <br />
            <select
              value={form.subChannel}
              onChange={(e) =>
                handleChange("subChannel", e.target.value as SubChannel)
              }
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
            >
              <option value="post_sosmed">Posting Sosial Media</option>
              <option value="ads_sosmed">Iklan Sosial Media</option>
              <option value="grabfood">GrabFood</option>
              <option value="shopeefood">ShopeeFood</option>
              <option value="direct">Direct / Teman</option>
              <option value="reseller">Reseller</option>
              <option value="referral">Referral</option>
            </select>
          </label>

          <label style={{ fontSize: "14px" }}>
            Nama Reseller / Referral
            <br />
            <input
              type="text"
              value={form.resellerName}
              onChange={(e) => handleChange("resellerName", e.target.value)}
              placeholder="Isi jika reseller atau referral"
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
              disabled={
                form.subChannel !== "reseller" && form.subChannel !== "referral"
              }
            />
          </label>

          <label style={{ fontSize: "14px" }}>
            Nama Pembeli (opsional)
            <br />
            <input
              type="text"
              value={form.buyerName}
              onChange={(e) => handleChange("buyerName", e.target.value)}
              placeholder="Boleh dikosongkan"
              style={{ width: "100%", padding: "6px 8px", marginTop: "4px" }}
            />
          </label>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={form.isFreeProduct}
            onChange={(e) => handleChange("isFreeProduct", e.target.checked)}
          />
          <span style={{ fontSize: "14px" }}>
            Free Product (tidak ada uang masuk, hanya catat keluar produk)
          </span>
        </label>

        <button
          type="submit"
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "999px",
            border: "none",
            backgroundColor: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          Simpan Order
        </button>
      </form>

      {/* TABEL RINGKASAN ORDER */}
      <section>
        <h2 style={{ marginBottom: "8px" }}>Order Terakhir</h2>
        {orders.length === 0 ? (
          <p style={{ color: "#777" }}>Belum ada order yang tercatat.</p>
        ) : (
          <>
            <div
              style={{
                overflowX: "auto",
                borderRadius: "12px",
                border: "1px solid #e2e2e2",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead style={{ background: "#f9fafb" }}>
                  <tr>
                    <th style={{ padding: "8px", textAlign: "left" }}>Tgl</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Produk</th>
                    <th style={{ padding: "8px" }}>Size</th>
                    <th style={{ padding: "8px" }}>Qty</th>
                    <th style={{ padding: "8px" }}>Harga</th>
                    <th style={{ padding: "8px" }}>Total</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Channel</th>
                    <th style={{ padding: "8px", textAlign: "left" }}>Reseller</th>
                    <th style={{ padding: "8px" }}>Subsidi</th>
                    <th style={{ padding: "8px" }}>Free?</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const total = o.qty * o.unitPrice;
                    return (
                      <tr key={o.id}>
                        <td style={{ padding: "6px 8px" }}>{o.date}</td>
                        <td style={{ padding: "6px 8px" }}>{o.productName}</td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          {o.size === "S" ? "Small (260ml)" : "Large (1L)"}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "center" }}>
                          {o.qty}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>
                          {o.unitPrice.toLocaleString("id-ID")}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>
                          {total.toLocaleString("id-ID")}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {o.channel === "online" ? "Online" : "Offline"} –{" "}
                          {subChannelLabel[o.subChannel]}
                        </td>
                        <td style={{ padding: "6px 8px" }}>
                          {o.resellerName || "-"}
                        </td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>
                          {o.shippingSubsidy > 0
                            ? o.shippingSubsidy.toLocaleString("id-ID")
                            : "-"}
                        </td>
                        <td
                          style={{
                            padding: "6px 8px",
                            textAlign: "center",
                            color: o.isFreeProduct ? "#dc2626" : "#16a34a",
                          }}
                        >
                          {o.isFreeProduct ? "Ya" : "Tidak"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p style={{ marginTop: "12px", fontSize: "14px" }}>
              Total omzet (tanpa free product):{" "}
              <b>Rp {totalRevenue.toLocaleString("id-ID")}</b>
              <br />
              Total subsidi ongkir (expense):{" "}
              <b>Rp {totalShippingSubsidy.toLocaleString("id-ID")}</b>
              <br />
              Omzet setelah subsidi ongkir (kasih gambaran net):{" "}
              <b>
                Rp{" "}
                {netRevenueAfterSubsidy > 0
                  ? netRevenueAfterSubsidy.toLocaleString("id-ID")
                  : 0}
              </b>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
