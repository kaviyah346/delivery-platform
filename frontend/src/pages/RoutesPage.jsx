import React, { useState, useEffect } from 'react';
import { routeApi } from '../api/routeApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { RouteBadge } from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RouteModal from '../components/routes/RouteModal';
import AssignOrdersModal from '../components/routes/AssignOrdersModal';
import { 
  Route, 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Edit2, 
  Trash2, 
  Truck, 
  Clock, 
  Gauge, 
  Package, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [routeModalOpen, setRouteModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignRoute, setAssignRoute] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [autoAllocating, setAutoAllocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadRoutes = () => {
    setLoading(true);
    routeApi.getAllRoutes()
      .then((res) => {
        if (res.data) setRoutes(res.data);
      })
      .catch(() => setErrorMsg('Failed to load transit routes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleOpenAdd = () => {
    setSelectedRoute(null);
    setRouteModalOpen(true);
  };

  const handleOpenEdit = (r) => {
    setSelectedRoute(r);
    setRouteModalOpen(true);
  };

  const handleSaveRoute = async (data) => {
    setSaving(true);
    setErrorMsg('');
    try {
      if (selectedRoute) {
        await routeApi.updateRoute(selectedRoute.id, data);
        setSuccessMsg(`Route ${selectedRoute.routeCode} updated successfully.`);
      } else {
        const res = await routeApi.createRoute(data);
        setSuccessMsg(`Route ${res.data.routeCode} created successfully.`);
      }
      setRouteModalOpen(false);
      loadRoutes();
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!routeToDelete) return;
    try {
      setErrorMsg('');
      await routeApi.deleteRoute(routeToDelete.id);
      setSuccessMsg(`Route ${routeToDelete.routeCode} removed.`);
      setDeleteConfirmOpen(false);
      setRouteToDelete(null);
      loadRoutes();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete route');
      setDeleteConfirmOpen(false);
    }
  };

  const handleAssignOrders = async (routeId, orderIds) => {
    await routeApi.assignOrdersToRoute(routeId, orderIds);
    setSuccessMsg(`Successfully allocated ${orderIds.length} shipment(s) to route.`);
    loadRoutes();
  };

  const handleAutoAllocate = async () => {
    setAutoAllocating(true);
    setErrorMsg('');
    try {
      const res = await routeApi.autoAllocateOrders();
      const count = res.data?.allocatedCount || 0;
      setSuccessMsg(`Automated Allocation Completed: ${count} shipments matched to vehicle capacities.`);
      loadRoutes();
    } catch (err) {
      setErrorMsg(err.message || 'Auto-allocation failed');
    } finally {
      setAutoAllocating(false);
    }
  };

  // Metrics
  const totalRoutes = routes.length;
  const activeRoutesCount = routes.filter((r) => r.status === 'IN_PROGRESS').length;
  const totalShipmentsAssigned = routes.reduce((sum, r) => sum + (r.assignedOrdersCount || 0), 0);
  const totalRouteWeight = routes.reduce((sum, r) => sum + (r.totalAssignedWeightKg || 0), 0);

  // Filtered routes
  const filteredRoutes = routes.filter((r) => {
    const matchesSearch = 
      (r.routeCode || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.origin || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.destination || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.vehicleNumber || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Messages */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-500 hover:text-emerald-800 font-bold">✕</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Configured Routes</span>
            <Route className="w-4 h-4 text-ups-brown" />
          </div>
          <div className="text-2xl font-black text-ups-brown">{totalRoutes}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            <span className="text-purple-600 font-bold">{activeRoutesCount} Active</span> corridors
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Shipments In Transit</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-ups-brown">{totalShipmentsAssigned}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            Orders mapped to routes
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Total Route Weight</span>
            <Gauge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-ups-brown">{totalRouteWeight.toFixed(1)} <span className="text-xs font-normal text-gray-500">kg</span></div>
          <div className="text-[11px] text-gray-400 mt-1">
            Active cargo in dispatch
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Capacity Safety Rate</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">100%</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Zero overload violations
          </div>
        </div>
      </div>

      {/* Toolbar with Auto-Allocate & Add Route */}
      <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search route code, origin, destination, vehicle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-ups-gold bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </div>

          {/* Auto Allocate Button */}
          <button
            onClick={handleAutoAllocate}
            disabled={autoAllocating}
            title="Automatically distribute pending orders to vehicles respecting max capacity"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ups-brown text-ups-gold hover:bg-black font-bold text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Zap className={`w-3.5 h-3.5 ${autoAllocating ? 'animate-bounce' : ''}`} />
            {autoAllocating ? 'Allocating...' : 'Auto-Allocate'}
          </button>

          {/* New Route Button */}
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Route
          </button>
        </div>
      </div>

      {/* Routes Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching delivery routes..." />
      ) : filteredRoutes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-ups-gray-border text-center shadow-sm">
          <Route className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-sm">No transit routes found</h3>
          <p className="text-xs text-gray-400 mt-1">Create a new delivery route or adjust your filter query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRoutes.map((r) => {
            const hasVehicle = !!r.vehicleNumber;
            const util = r.vehicleMaxCapacityKg > 0 ? (r.vehicleCurrentLoadKg / r.vehicleMaxCapacityKg) * 100 : 0;

            return (
              <div key={r.id} className="bg-white rounded-xl border border-ups-gray-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div className="p-5">
                  {/* Top Bar: Code and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ups-brown text-base tracking-tight font-mono">
                          {r.routeCode}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">#{r.id}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Gauge className="w-3.5 h-3.5 text-gray-400" />
                          {r.totalDistanceKm} km
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          ~{r.estimatedDurationHours} hrs
                        </span>
                      </div>
                    </div>
                    <RouteBadge status={r.status} />
                  </div>

                  {/* Corridor Path */}
                  <div className="my-3.5 p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex-1">
                      <span className="text-[10px] uppercase font-bold text-blue-600 block">Origin Hub</span>
                      <strong className="text-gray-800 text-xs truncate block" title={r.origin}>
                        {r.origin}
                      </strong>
                    </div>

                    <div className="px-3 text-gray-400">
                      <ArrowRight className="w-4 h-4 text-ups-gold" />
                    </div>

                    <div className="flex-1 text-right">
                      <span className="text-[10px] uppercase font-bold text-rose-600 block">Destination</span>
                      <strong className="text-gray-800 text-xs truncate block" title={r.destination}>
                        {r.destination}
                      </strong>
                    </div>
                  </div>

                  {/* Assigned Vehicle & Load */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Truck className="w-3.5 h-3.5 text-amber-700" />
                        Carrier:
                      </span>
                      {hasVehicle ? (
                        <span className="font-bold text-ups-brown">
                          {r.vehicleNumber} ({r.vehicleModel})
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No carrier assigned</span>
                      )}
                    </div>

                    {hasVehicle && (
                      <div className="p-2 rounded bg-amber-50/60 border border-amber-100 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-600">Carrier Payload:</span>
                          <span className="font-bold text-ups-brown">
                            {r.vehicleCurrentLoadKg} / {r.vehicleMaxCapacityKg} kg ({util.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${util >= 100 ? 'bg-rose-500' : util > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, util)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1">
                      <span>Assigned Shipments: <strong>{r.assignedOrdersCount} parcels</strong></span>
                      <span>Route Weight: <strong>{r.totalAssignedWeightKg?.toFixed(1) || 0} kg</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setAssignRoute(r);
                      setAssignModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Assign Orders
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      title="Edit Route"
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setRouteToDelete(r);
                        setDeleteConfirmOpen(true);
                      }}
                      title="Delete Route"
                      className="p-1.5 rounded hover:bg-rose-100 text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Route Modal */}
      <RouteModal
        isOpen={routeModalOpen}
        onClose={() => setRouteModalOpen(false)}
        onSave={handleSaveRoute}
        route={selectedRoute}
        isSaving={saving}
      />

      {/* Assign Orders to Route Modal */}
      <AssignOrdersModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        route={assignRoute}
        onAssigned={handleAssignOrders}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Route"
        message={`Are you sure you want to delete route ${routeToDelete?.routeCode}? Any assigned orders will be detached but retained in the system.`}
        confirmText="Delete Route"
      />
    </div>
  );
}
