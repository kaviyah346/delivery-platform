import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import OrdersPage from './pages/OrdersPage';
import FleetPage from './pages/FleetPage';
import RoutesPage from './pages/RoutesPage';
import TrackingPage from './pages/TrackingPage';
import ChatbotPage from './pages/ChatbotPage';
import ChatbotDrawer from './components/chatbot/ChatbotDrawer';
import Toast from './components/common/Toast';
import OrderFormModal from './components/orders/OrderFormModal';
import { orderApi } from './api/orderApi';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Global Quick Add Modal
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddSubmitting, setQuickAddSubmitting] = useState(false);
  const [quickAddErrors, setQuickAddErrors] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  const handleDataChange = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return {
          title: 'Operations Dashboard',
          subtitle: 'Live operational metrics & fleet utilization',
        };
      case '/orders':
        return {
          title: 'Delivery Order Management',
          subtitle: 'Customer shipments and parcel lifecycle tracking',
        };
      case '/fleet':
        return {
          title: 'Fleet & Vehicle Capacity Management',
          subtitle: 'Live carrier payload limits, maintenance & driver assignments',
        };
      case '/routes':
        return {
          title: 'Route Planning & Capacity Allocation',
          subtitle: 'Multi-stop transit corridors & automated payload optimization',
        };
      case '/reports':
        return {
          title: 'Delivery Tracking & SLA Reports',
          subtitle: 'Real-time milestone progression & fleet SLA intelligence',
        };
      case '/chatbot':
        return {
          title: 'AI Logistics Dispatcher',
          subtitle: 'Natural language queries for parcel tracking & capacity audits',
        };
      default:
        return {
          title: 'Logistics Management System',
          subtitle: 'Route & Vehicle Capacity Platform',
        };
    }
  };

  const handleQuickAddSubmit = async (formData) => {
    try {
      setQuickAddSubmitting(true);
      setQuickAddErrors(null);
      const res = await orderApi.createOrder(formData);
      showToast({
        type: 'success',
        title: 'Order Created',
        message: `Delivery order ${res.data.orderId} created successfully.`,
      });
      setQuickAddOpen(false);
      handleDataChange();
      if (location.pathname !== '/orders') {
        navigate('/orders');
      }
    } catch (err) {
      if (err.validationErrors) {
        setQuickAddErrors(err.validationErrors);
      }
      showToast({
        type: 'error',
        title: 'Creation Failed',
        message: err.message,
      });
    } finally {
      setQuickAddSubmitting(false);
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <Layout
      title={title}
      subtitle={subtitle}
      onNewOrderClick={() => setQuickAddOpen(true)}
      onRefresh={handleDataChange}
    >
      <Routes>
        <Route 
          path="/" 
          element={<DashboardPage onNewOrderClick={() => setQuickAddOpen(true)} toastRefreshTrigger={refreshTrigger} />} 
        />
        <Route 
          path="/dashboard" 
          element={<DashboardPage onNewOrderClick={() => setQuickAddOpen(true)} toastRefreshTrigger={refreshTrigger} />} 
        />
        <Route 
          path="/orders" 
          element={<OrdersPage showToast={showToast} onDataChange={handleDataChange} />} 
        />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/reports" element={<TrackingPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Global Quick Add Order Modal */}
      <OrderFormModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAddSubmit}
        isSubmitting={quickAddSubmitting}
        serverErrors={quickAddErrors}
      />

      {/* Global Floating AI Logistics Dispatcher Chatbot */}
      {location.pathname !== '/chatbot' && <ChatbotDrawer isFloating={true} />}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
