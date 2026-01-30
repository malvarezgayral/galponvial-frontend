import React, { useState } from "react";
import AdminDashboard from "../components/AdminDashboard";
//import RolesManagement from "../components/RolesManagement";
//import PermissionsManagement from "../components/PermissionsManagement";

type TabType = "usuarios" | "roles" | "permisos";

const UsuariosPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("usuarios");

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "usuarios", label: "Usuarios", icon: "👥" },
    //{ id: "roles", label: "Roles", icon: "🎭" },
    //{ id: "permisos", label: "Permisos", icon: "🔐" },
  ];

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg-light)] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona usuarios, roles y permisos del sistema
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-lg transition-all duration-300 border-b-4 ${
                activeTab === tab.id
                  ? "border-[var(--color-navbar-nav)] text-[var(--color-navbar-nav)]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === "usuarios" && <AdminDashboard />}
          {/*{activeTab === 'roles' && <RolesManagement />}
          {activeTab === 'permisos' && <PermissionsManagement />}*/}
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
