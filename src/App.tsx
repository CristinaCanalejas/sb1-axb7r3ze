import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import LoginPage from './components/auth/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import FuelPage from './pages/FuelPage';
import EquipmentPage from './pages/EquipmentPage';
import EquipmentStatusPage from './pages/EquipmentStatusPage';
import EquipmentInServicePage from './pages/EquipmentInServicePage';
import EquipmentWorkingPage from './pages/EquipmentWorkingPage';
import PersonnelPage from './pages/PersonnelPage';
import ClothingPPERequestPage from './pages/ClothingPPERequestPage';
import StatsPage from './pages/StatsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ShiftsPage from './pages/ShiftsPage';
import MechanicsPage from './pages/MechanicsPage';
import WarehousePage from './pages/WarehousePage';
import PurchaseRequestsPage from './pages/PurchaseRequestsPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <Header />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="container mx-auto">
                      <Routes>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/fuel" element={<FuelPage />} />
                        <Route path="/equipment-status" element={<EquipmentStatusPage />} />
                        <Route path="/equipment" element={<EquipmentPage />} />
                        <Route path="/equipment-in-service" element={<EquipmentInServicePage />} />
                        <Route path="/equipment-working" element={<EquipmentWorkingPage />} />
                        <Route path="/personnel" element={<PersonnelPage />} />
                        <Route path="/clothing-ppe" element={<ClothingPPERequestPage />} />
                        <Route path="/shifts" element={<ShiftsPage />} />
                        <Route path="/mechanics" element={<MechanicsPage />} />
                        <Route path="/warehouse" element={<WarehousePage />} />
                        <Route path="/purchase-requests" element={<PurchaseRequestsPage />} />
                        <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
                        <Route path="/stats" element={<StatsPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;