// apps/web/app/admin/dashboard/page.tsx
import React from "react";

interface Stats {
  revenue?: number;
  users?: number;
  // ajoute d'autres champs si nécessaire
}

interface PageProps {
  stats?: Stats;
}

const DashboardPage = ({ stats }: PageProps) => {
  // Fallbacks pour éviter les undefined
  const safeStats = stats || {};
  const revenue = safeStats.revenue ?? 0;
  const users = safeStats.users ?? 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p>${revenue}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Users</h2>
          <p>{users}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
