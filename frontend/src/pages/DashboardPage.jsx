import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../api/dashboardApi';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Route, 
  ArrowRight,
  TrendingUp,
  Scale,
  Plus,
  RefreshCw
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';

export default function DashboardPage({ onNewOrderClick, toastRefreshTrigger }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getDashboardStats();
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [toastRefreshTrigger]);

  if (loading && !stats) {
    return <LoadingSpinner message="Loading Logistics Operations Dashboard..." />;
  }

  if (error && !stats) {
    return (
      <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-600" />
        <h3 className="font-bold text-base">Backend Connection Error</h3>
        <p className="text-xs text-rose-600 mt-1 mb-4">{error}</p>
        <button
          type="button"
          onClick={fetchStats}
          className="px-4 py-2 bg-ups-brown text-white font-semibold text-xs rounded-lg hover:bg-ups-brown-light"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const {
    totalDeliveryOrders = 0,
    pendingDeliveries = 0,
    deliveredOrders = 0,
    availableVehicles = 0,
    occupiedVehicles = 0,
    activeDeliveryRoutes = 0,
    totalFleetCapacityKg = 0,
    currentAssignedLoadKg = 0,
    fleetUtilizationPercentage = 0,
    statusDistribution = [],
    priorityDistribution = [],
    vehicleUtilizationList = [],
    recentOrders = []
  } = stats || {};

  return (
    <div className="space-y-6">
      {/* Top Banner / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-ups-gray-border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-ups-brown">Operations Control Center</h2>
          </div>
          <p className="text-xs text-ups-text-muted mt-0.5">
            Real-time delivery logistics and vehicle capacity monitoring powered by PostgreSQL.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchStats}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-ups-brown bg-ups-gray-bg hover:bg-ups-gray-hover rounded-lg border border-ups-gray-border transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Metrics
          </button>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-ups-gold hover:bg-ups-gold-hover text-ups-brown rounded-lg shadow-sm transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            Manage Orders
          </button>
        </div>
      </div>

      {/* 6 Key Statistics Cards Required by Spec */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Orders"
          value={totalDeliveryOrders}
          icon={Package}
          color="brown"
          subtext="Active in platform"
        />
        <StatCard
          title="Pending"
          value={pendingDeliveries}
          icon={Clock}
          color="gold"
          subtext="Awaiting delivery"
        />
        <StatCard
          title="Delivered"
          value={deliveredOrders}
          icon={CheckCircle2}
          color="green"
          subtext="Completed orders"
        />
        <StatCard
          title="Available Fleet"
          value={availableVehicles}
          icon={Truck}
          color="blue"
          subtext="Ready for dispatch"
        />
        <StatCard
          title="Occupied Fleet"
          value={occupiedVehicles}
          icon={Truck}
          color="purple"
          subtext="Currently carrying load"
        />
        <StatCard
          title="Active Routes"
          value={activeDeliveryRoutes}
          icon={Route}
          color="red"
          subtext="Routes in transit"
        />
      </div>

      {/* Charts & Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Delivery Status Distribution (Pie Chart) */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-ups-gray-border flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-ups-brown">Delivery Status Distribution</h3>
              <p className="text-[11px] text-ups-text-muted">Breakdown of orders across shipment stages</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {statusDistribution.some(s => s.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val, name) => [`${val} orders`, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E4E8', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-ups-text-dark font-medium">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-ups-text-muted">
                No orders data to display
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Priority Overview (Bar Chart) */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-ups-gray-border flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-ups-brown">Orders by Delivery Priority</h3>
              <p className="text-[11px] text-ups-text-muted">Operational urgency categorization</p>
            </div>
          </div>
          <div className="h-64 w-full">
            {priorityDistribution.some(p => p.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECEEF2" />
                  <XAxis dataKey="priority" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val) => [`${val} orders`, 'Count']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E2E4E8', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {priorityDistribution.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-ups-text-muted">
                No priority data available
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Fleet Carrying Capacity Utilization */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-ups-gray-border flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-ups-brown">Vehicle Capacity Utilization</h3>
              <p className="text-[11px] text-ups-text-muted">Assigned package weight vs max vehicle limit</p>
            </div>
            <span className="text-xs font-mono font-bold text-ups-brown bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {fleetUtilizationPercentage}% Overall
            </span>
          </div>

          {/* Fleet overall capacity progress bar */}
          <div className="p-3 bg-ups-gray-bg rounded-lg mb-3">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-ups-text-dark flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-ups-gold" /> Total Active Load
              </span>
              <span className="font-mono text-ups-brown">
                {currentAssignedLoadKg} / {totalFleetCapacityKg} kg
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-ups-gold h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, fleetUtilizationPercentage)}%` }}
              />
            </div>
          </div>

          {/* Individual vehicles capacity list */}
          <div className="flex-1 overflow-y-auto max-h-48 space-y-2.5 pr-1">
            {vehicleUtilizationList.map((v) => {
              const util = v.utilizationPercentage || 0;
              const isOverloaded = util >= 100;
              return (
                <div key={v.vehicleId} className="text-xs p-2 rounded-lg border border-ups-gray-border hover:bg-ups-gray-bg transition">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-ups-brown">{v.vehicleNumber ? v.vehicleNumber.replace(/^UPS-/, '') : ''}</span>
                    <span className="text-[10px] text-ups-text-muted">
                      {v.currentLoadKg} / {v.maxCapacityKg} kg ({util}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-1.5 rounded-full ${isOverloaded ? 'bg-rose-500' : util > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, util)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Delivery Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-ups-gray-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-ups-brown">Recent Delivery Orders</h3>
            <p className="text-xs text-ups-text-muted">Latest shipments processed and persisted in the database</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ups-brown hover:text-amber-800 transition-colors"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ups-gray-bg text-ups-text-muted text-[11px] uppercase tracking-wider font-semibold border-b border-ups-gray-border">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Pickup Location</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Package Weight</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ups-gray-border text-xs">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-ups-brown whitespace-nowrap">
                      {order.orderId ? order.orderId.replace(/^UPS-/, '') : ''}
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate" title={order.pickupAddress}>
                      {order.pickupAddress}
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate" title={order.destinationAddress}>
                      {order.destinationAddress}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-semibold">
                      {order.packageWeight ? `${order.packageWeight.toFixed(1)} kg` : '0 kg'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-ups-text-muted">
                    No delivery orders found. Create your first order to populate the dashboard.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
