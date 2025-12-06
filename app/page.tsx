import Link from "next/link";

const menuItems = [
  { href: "/orders", title: "Pencatatan Order" },
  { href: "/purchases", title: "Pembelian Bahan" },
  { href: "/stocks", title: "Stock Opname" },
  { href: "/resellers", title: "Reseller & Channel" },
  { href: "/reports", title: "Laporan & Pembukuan" },
];

export default function Home() {
  return (
    <main
      style={{
        padding: "32px",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>Gemahripah Console</h1>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Pilih menu untuk mengelola order, pembelian bahan, stok, dan laporan.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              border: "1px solid #e2e2e2",
              borderRadius: "12px",
              padding: "16px",
              textDecoration: "none",
              color: "#111",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
              {item.title}
            </h2>
            <p style={{ fontSize: "13px", color: "#666" }}>
              {item.href === "/orders" &&
                "Input order harian dari semua channel penjualan."}
              {item.href === "/purchases" &&
                "Catat pembelian bahan, harga per batch, dan supplier."}
              {item.href === "/stocks" &&
                "Lihat stok bahan & produk jadi, termasuk stock opname."}
              {item.href === "/resellers" &&
                "Kelola reseller, komisi, dan performa penjualan mereka."}
              {item.href === "/reports" &&
                "Ringkasan omzet, HPP, margin, dan laba rugi sederhana."}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
