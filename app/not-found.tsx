import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap" style={{ paddingTop: 60 }}>
      <div className="empty">Page not found. <Link href="/" style={{ color: "var(--primary)", fontWeight: 700 }}>Back to home</Link></div>
    </section>
  );
}
