import Link from "next/link";

export default function OrdersPage() {
  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Pencatatan Order</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Di halaman ini nanti kamu bisa input semua order: online, offline,
        reseller, dan free product.
      </p>

      <div
        style={{
          border: "1px solid #e2e2e2",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>
          Form Order (coming soon)
        </h2>
        <p style={{ fontSize: "13px", color: "#777" }}>
          Nanti di sini ada form: tanggal, produk, jumlah, harga, channel,
          reseller, dan status pembayaran.
        </p>
      </div>

      <div
        style={{
          border: "1px solid #e2e2e2",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <h2 style={{ fontSize: "16px", marginBottom: "8px" }}>
          Daftar Order Terakhir (coming soon)
        </h2>
        <p style={{ fontSize: "13px", color: "#777" }}>
          Nanti di sini ada tabel order yang bisa difilter per tanggal dan
          channel.
        </p>
      </div>

      <p style={{ marginTop: "24px" }}>
        <Link href="/" style={{ color: "#0070f3" }}>
          ← Kembali ke Dashboard
        </Link>
      </p>
    </main>
  );
}
