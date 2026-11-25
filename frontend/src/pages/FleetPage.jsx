import React, { useState, useEffect } from 'react';
import { vehicleApi } from '../api/vehicleApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { VehicleBadge } from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import VehicleModal from '../components/fleet/VehicleModal';
import VehicleOrdersModal from '../components/fleet/VehicleOrdersModal';
import { 
  Truck, 
  Scale, 
  Plus, 
  Search, 
  Filter, 
  Wrench, 
  Edit2, 
  Trash2, 
  Package, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Phone,
  User
} from 'lucide-react';

export default function FleetPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [ordersVehicle, setOrdersVehicle] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadVehicles = () => {
    setLoading(true);
    vehicleApi.getAllVehicles()
      .then((res) => {
        if (res.data) setVehicles(res.data);
      })
      .catch((err) => {
        setErrorMsg('Failed to load fleet vehicles');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleOpenAdd = () => {
    setSelectedVehicle(null);
    setVehicleModalOpen(true);
  };

  const handleOpenEdit = (v) => {
    setSelectedVehicle(v);
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (data) => {
    setSaving(true);
    setErrorMsg('');
    try {
      if (selectedVehicle) {
        await vehicleApi.updateVehicle(selectedVehicle.id, data);
        setSuccessMsg(`Vehicle ${selectedVehicle.vehicleNumber} updated successfully.`);
      } else {
        const res = await vehicleApi.createVehicle(data);
        setSuccessMsg(`Vehicle ${res.data.vehicleNumber} registered successfully.`);
      }
      setVehicleModalOpen(false);
      loadVehicles();
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMaintenance = async (v) => {
    try {
      setErrorMsg('');
      const res = await vehicleApi.toggleMaintenance(v.id);
      setSuccessMsg(`Vehicle ${v.vehicleNumber} status changed to ${res.data.status}`);
      loadVehicles();
    } catch (err) {
      setErrorMsg(err.message || 'Could not update maintenance status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      setErrorMsg('');
      await vehicleApi.deleteVehicle(vehicleToDelete.id);
      setSuccessMsg(`Vehicle ${vehicleToDelete.vehicleNumber} removed from fleet.`);
      setDeleteConfirmOpen(false);
      setVehicleToDelete(null);
      loadVehicles();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete vehicle');
      setDeleteConfirmOpen(false);
    }
  };

  // Metrics calculation
  const totalVehicles = vehicles.length;
  const availableCount = vehicles.filter((v) => v.status === 'AVAILABLE').length;
  const occupiedCount = vehicles.filter((v) => v.status === 'OCCUPIED').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'MAINTENANCE').length;

  const totalMaxCap = vehicles.reduce((sum, v) => sum + (v.maxCapacityKg || 0), 0);
  const totalCurrLoad = vehicles.reduce((sum, v) => sum + (v.currentLoadKg || 0), 0);
  const fleetUtil = totalMaxCap > 0 ? (totalCurrLoad / totalMaxCap) * 100 : 0;

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = 
      (v.vehicleNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.model || '').toLowerCase().includes(search.toLowerCase()) ||
      (v.driverName || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Alert Banners */}
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
            <span>Total Fleet</span>
            <Truck className="w-4 h-4 text-ups-brown" />
          </div>
          <div className="text-2xl font-black text-ups-brown">{totalVehicles}</div>
          <div className="text-[11px] text-gray-400 mt-1">
            <span className="text-emerald-600 font-bold">{availableCount} Available</span> · {occupiedCount} Active
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Fleet Utilization</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-ups-brown">{fleetUtil.toFixed(1)}%</div>
          <div className="text-[11px] text-gray-400 mt-1">
            Capacity efficiency
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Current Fleet Load</span>
            <Scale className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-ups-brown">{totalCurrLoad.toFixed(1)} <span className="text-xs font-normal text-gray-500">kg</span></div>
          <div className="text-[11px] text-gray-400 mt-1">
            of {totalMaxCap.toFixed(0)} kg max capacity
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <span>Overload Violations</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600">0</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            100% capacity safety compliant
          </div>
        </div>
      </div>

      {/* Action and Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-ups-gray-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search carrier ID, model, driver..."
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
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Fetching fleet records..." />
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-ups-gray-border text-center shadow-sm">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-sm">No vehicles found</h3>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria or register a new vehicle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((v) => {
            const util = v.maxCapacityKg > 0 ? (v.currentLoadKg / v.maxCapacityKg) * 100 : 0;
            const remainingKg = Math.max(0, v.maxCapacityKg - v.currentLoadKg);

            return (
              <div 
                key={v.id} 
                className={`bg-white rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  v.status === 'MAINTENANCE' ? 'border-rose-200 bg-rose-50/20' : 'border-ups-gray-border'
                }`}
              >
                <div className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-ups-brown text-base tracking-tight">{v.vehicleNumber}</h4>
                        <span className="font-mono text-[10px] text-gray-400">#{v.id}</span>
                      </div>
                      <p className="text-xs text-ups-text-muted mt-0.5">{v.model}</p>
                    </div>
                    <VehicleBadge status={v.status} />
                  </div>

                  {/* Load Capacity Bar & Numbers */}
                  <div className="my-4 p-3 rounded-lg bg-gray-50 border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 font-medium flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-gray-400" />
                        Payload:
                      </span>
                      <span className="font-bold text-ups-brown">
                        {v.currentLoadKg} / {v.maxCapacityKg} kg
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          util >= 100 ? 'bg-rose-500' : util > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, util)}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] pt-1">
                      <span className="text-gray-500">Utilization: <strong>{util.toFixed(1)}%</strong></span>
                      <span className="text-emerald-700 font-semibold">
                        Free: <strong>{remainingKg.toFixed(1)} kg</strong>
                      </span>
                    </div>
                  </div>

                  {/* Driver Information */}
                  <div className="space-y-1 text-xs text-gray-600 mb-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>Driver: <strong className="text-gray-800">{v.driverName || 'Unassigned'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[11px] text-gray-500">{v.driverContact || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setOrdersVehicle(v);
                      setOrdersModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-ups-brown hover:text-amber-800 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-700" />
                    Orders ({v.currentLoadKg > 0 ? 'Active' : '0'})
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleMaintenance(v)}
                      title={v.status === 'MAINTENANCE' ? 'Return to Service' : 'Send to Maintenance'}
                      className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                        v.status === 'MAINTENANCE' ? 'text-amber-700 bg-amber-100' : 'text-gray-500'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(v)}
                      title="Edit Vehicle"
                      className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setVehicleToDelete(v);
                        setDeleteConfirmOpen(true);
                      }}
                      title="Delete Vehicle"
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

      {/* Vehicle Form Modal */}
      <VehicleModal
        isOpen={vehicleModalOpen}
        onClose={() => setVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={selectedVehicle}
        isSaving={saving}
      />

      {/* Orders Viewer Modal */}
      <VehicleOrdersModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
        vehicle={ordersVehicle}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to remove carrier ${vehicleToDelete?.vehicleNumber} from the active fleet? This action cannot be undone.`}
        confirmText="Delete Vehicle"
      />
    </div>
  );
}
