import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { orderApi } from '../../api/orderApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { PriorityBadge } from '../common/Badge';
import { Scale, Package, AlertTriangle, CheckCircle2, Truck } from 'lucide-react';

export default function AssignOrdersModal({ isOpen, onClose, route, onAssigned }) {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setErrorMsg('');
      setSelectedIds([]);
      // Fetch orders that are unassigned or pending
      orderApi.getAllOrders({ status: 'PENDING' })
        .then((res) => {
          if (res.data) {
            // Filter orders not already on this route
            const unassigned = res.data.filter((o) => !o.routeId || o.routeId !== route.id);
            setPendingOrders(unassigned);
          }
        })
        .catch(() => setPendingOrders([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, route]);

  if (!route) return null;

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedOrders = pendingOrders.filter((o) => selectedIds.includes(o.id));
  const newSelectedWeight = selectedOrders.reduce((sum, o) => sum + (o.packageWeight || 0), 0);

  // Vehicle capacity checks
  const maxCap = route.vehicleMaxCapacityKg || 0;
  const currLoad = route.vehicleCurrentLoadKg || 0;
  const projectedTotalLoad = currLoad + newSelectedWeight;
  const isOverCapacity = maxCap > 0 && projectedTotalLoad > maxCap;

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return;
    if (isOverCapacity) {
      setErrorMsg(`Cannot assign: projected payload (${projectedTotalLoad.toFixed(1)} kg) exceeds vehicle max capacity of ${maxCap} kg.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      await onAssigned(route.id, selectedIds);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to assign orders to route');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Orders to ${route.routeCode}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Capacity Warning Banner */}
        <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
          isOverCapacity ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              Carrier: {route.vehicleNumber ? `${route.vehicleNumber} (${route.vehicleModel})` : 'No carrier linked to route'}
            </span>
            <span>
              {maxCap > 0 ? `Max Payload: ${maxCap} kg` : 'Unlimited / Generic'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/50">
            <span>Current load: <strong>{currLoad.toFixed(1)} kg</strong></span>
            <span>Adding: <strong className={isOverCapacity ? 'text-rose-600' : 'text-ups-brown'}>+{newSelectedWeight.toFixed(1)} kg</strong></span>
            <span>Projected total: <strong className={isOverCapacity ? 'text-rose-600 font-black' : 'text-emerald-700'}>{projectedTotalLoad.toFixed(1)} kg</strong></span>
          </div>

          {isOverCapacity && (
            <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold mt-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Safety Limit Exceeded! Vehicle cannot carry more than {maxCap} kg. Uncheck heavy parcels to continue.</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            {errorMsg}
          </div>
        )}

        {/* Orders Selection List */}
        {loading ? (
          <LoadingSpinner message="Loading pending unallocated orders..." />
        ) : pendingOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium">No pending unassigned orders found.</p>
            <p className="text-xs text-gray-400">All customer orders are currently assigned to vehicles and routes.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
              <span>Select orders to allocate ({selectedIds.length} chosen):</span>
              <button
                type="button"
                onClick={() => {
                  if (selectedIds.length === pendingOrders.length) setSelectedIds([]);
                  else setSelectedIds(pendingOrders.map((o) => o.id));
                }}
                className="text-ups-brown font-bold hover:underline"
              >
                {selectedIds.length === pendingOrders.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
              {pendingOrders.map((order) => {
                const isSelected = selectedIds.includes(order.id);
                return (
                  <label
                    key={order.id}
                    className={`flex items-center justify-between p-3 cursor-pointer text-xs transition-colors ${
                      isSelected ? 'bg-amber-50/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(order.id)}
                        className="w-4 h-4 text-ups-gold rounded focus:ring-ups-gold border-gray-300"
                      />
                      <div>
                        <div className="font-bold text-ups-brown font-mono">{order.orderId}</div>
                        <div className="text-gray-600">{order.customerName} → {order.destinationAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PriorityBadge priority={order.priority} />
                      <span className="font-bold text-gray-800 text-xs w-16 text-right">
                        {order.packageWeight} kg
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            Selected: <strong className="text-gray-800">{selectedIds.length} orders</strong> ({newSelectedWeight.toFixed(1)} kg)
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIds.length === 0 || isOverCapacity || submitting}
              className="px-4 py-2 text-xs font-bold text-ups-brown bg-ups-gold hover:bg-ups-gold-hover rounded-lg shadow-sm transition-all disabled:opacity-40"
            >
              {submitting ? 'Assigning...' : `Assign ${selectedIds.length} Orders`}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
