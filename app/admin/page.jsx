import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllJuices } from "@/lib/queries";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin />;
  }

  const [orders, juices] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 200,
    }),
    getAllJuices(),
  ]);

  // Sérialise les dates pour le composant client.
  const safeOrders = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return <AdminDashboard initialOrders={safeOrders} initialJuices={juices} />;
}
