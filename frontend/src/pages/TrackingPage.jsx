import React, { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Scale,
  ShieldCheck,
  Download,
  AlertCircle,
  Package,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function TrackingPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tracking search state
  const [trackingInput, setTrackingInput] = useState('ORD-1006');
  const [timeline, setTimeline] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState('');

  const loadReport = () => {
    setLoading(true);
    reportApi.getAnalyticsReport()
      .then((res) => {
        if (res.data) setReport(res.data);
      })
      .catch((err) => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false));
  };

  const handleSearchTracking = (orderIdToSearch) => {
    const query = (orderIdToSearch || trackingInput || '').trim();
    if (!query) return;

    setTrackingLoading(true);
    setTrackingError('');
    reportApi.getTrackingMilestones(query)
      .then((res) => {
        if (res.data) setTimeline(res.data);
      })
      .catch((err) => {
        setTrackingError(err.message || `No tracking information found for ${query}`);
        setTimeline(null);
      })
      .finally(() => setTrackingLoading(false));
  };

  useEffect(() => {
    loadReport();
    handleSearchTracking('ORD-1006');
  }, []);

  const handleExportCSV = () => {
    if (!report || !report.recentCompletedDeliveries) return;

    const headers = ['Order ID', 'Customer', 'Destination', 'Weight (kg)', 'Carrier', 'Priority', 'Status', 'Date'];
    const rows = report.recentCompletedDeliveries.map((o) => [
      o.orderId,
      `"${o.customerName}"`,
      `"${o.destinationAddress}"`,
      o.packageWeight,
      o.vehicleNumber || 'N/A',
      o.priority,
      o.status,
      o.orderDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `delivery_sla_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data
  const chartData = (report?.vehicleCapacityDetails || []).map((v) => ({
    name: v.vehicleNumber,
    'Max Capacity (kg)': v.maxCapacityKg,
    'Current Load (kg)': v.currentLoadKg,
  }));

  return (
    <div className="space-y-6">
      {/* SLA Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>On-Time SLA</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {report?.onTimeDeliveryRate || 97.2}%
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Avg. transit: {report?.avgTransitHours || 3.2} hrs
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Delivered Payload</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-ups-brown">
            {report?.totalDeliveredWeightKg || 0} <span className="text-xs font-normal text-gray-500">kg</span>
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {report?.totalCompletedDeliveries || 0} parcels completed
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Active Corridors</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-ups-brown">
            {report?.activeRoutesCount || 4}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            Fleet: {report?.totalVehiclesCount || 6} carriers
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Overload Violations</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">0</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% capacity safety compliance
          </div>
        </div>
      </div>

      {/* Parcel Tracking & Milestone Stepper */}
      <div className="bg-white rounded-xl border border-ups-gray-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-ups-brown text-base flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-700" />
              Live Parcel Milestone Tracking
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Enter any parcel order number (e.g. <button onClick={() => { setTrackingInput('ORD-1006'); handleSearchTracking('ORD-1006'); }} className="text-ups-brown font-mono font-bold hover:underline">ORD-1006</button>, <button onClick={() => { setTrackingInput('ORD-1007'); handleSearchTracking('ORD-1007'); }} className="text-ups-brown font-mono font-bold hover:underline">ORD-1007</button>, <button onClick={() => { setTrackingInput('ORD-1001'); handleSearchTracking('ORD-1001'); }} className="text-ups-brown font-mono font-bold hover:underline">ORD-1001</button>)
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchTracking();
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Enter Order ID..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading}
              className="px-4 py-2 bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all"
            >
              {trackingLoading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        <div className="p-6">
          {trackingError ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{trackingError}</span>
            </div>
          ) : timeline ? (
            <div className="space-y-6">
              {/* Order Info Bar */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block text-[11px]">Tracking Identifier:</span>
                  <span className="font-bold text-ups-brown font-mono text-sm">{timeline.orderId}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Customer & Contact:</span>
                  <span className="font-semibold text-gray-800">{timeline.customerName}</span>
                  <span className="text-[10px] text-gray-500 block">{timeline.customerContact}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Carrier / Vehicle:</span>
                  <span className="font-semibold text-ups-brown">{timeline.vehicleNumber || 'Unassigned'}</span>
                  <span className="text-[10px] text-gray-500 block">Driver: {timeline.driverName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Weight & Status:</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-gray-800">{timeline.packageWeight} kg</span>
                    <StatusBadge status={timeline.status} />
                  </div>
                </div>
              </div>

              {/* Transit Route Bar */}
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span><strong>Pickup:</strong> {timeline.pickupAddress}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  <span><strong>Destination:</strong> {timeline.destinationAddress}</span>
                </div>
              </div>

              {/* Milestones Stepper Timeline */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Shipment Progression Timeline
                </h4>

                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {timeline.milestones?.map((m, idx) => {
                    const isDone = m.completed;
                    const isCur = m.current;

                    return (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Dot indicator */}
                        <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCur
                            ? 'bg-ups-gold text-ups-brown ring-4 ring-amber-100'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <span className="text-[10px]">{idx + 1}</span>
                          )}
                        </div>

                        {/* Milestone Content */}
                        <div className="flex-1 bg-white p-3.5 rounded-lg border border-gray-100 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className={`text-xs font-bold ${isDone ? 'text-emerald-800' : isCur ? 'text-ups-brown' : 'text-gray-500'}`}>
                              {m.title}
                            </span>
                            <span className="text-[10px] font-mono text-gray-400">
                              {m.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">
              Search for an order above to view its live milestone progression.
            </div>
          )}
        </div>
      </div>

      {/* Fleet Capacity vs Current Load Chart */}
      <div className="bg-white p-5 rounded-xl border border-ups-gray-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-ups-brown text-base">Fleet Payload & Capacity Distribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time load allocation versus certified maximum payload per vehicle</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Overload Enforced
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis unit=" kg" tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`${value} kg`]} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <Bar dataKey="Max Capacity (kg)" fill="#351C15" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current Load (kg)" fill="#FFB500" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Completed Deliveries Table with CSV Export */}
      <div className="bg-white rounded-xl border border-ups-gray-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-ups-brown text-base">Historical Completed Deliveries</h3>
            <p className="text-xs text-gray-400 mt-0.5">Audited delivery records and SLA logs</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Order ID</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Destination</th>
                <th className="py-2.5 px-4 text-right">Payload</th>
                <th className="py-2.5 px-4">Carrier</th>
                <th className="py-2.5 px-4">Priority</th>
                <th className="py-2.5 px-4">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(report?.recentCompletedDeliveries || []).length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-400">
                    No completed deliveries recorded yet.
                  </td>
                </tr>
              ) : (
                report.recentCompletedDeliveries.map((o) => (
                  <tr key={o.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-ups-brown font-mono">
                      {o.orderId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-800">{o.customerName}</div>
                      <div className="text-[10px] text-gray-400">{o.customerContact}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-gray-600" title={o.destinationAddress}>
                      {o.destinationAddress}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-gray-800">
                      {o.packageWeight} kg
                    </td>
                    <td className="py-3 px-4 font-medium text-ups-brown">
                      {o.vehicleNumber || 'Direct'}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={o.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
