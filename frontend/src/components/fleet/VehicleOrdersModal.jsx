import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { vehicleApi } from '../../api/vehicleApi';
import LoadingSpinner from '../common/LoadingSpinner';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Package, Truck, Scale, MapPin } from 'lucide-react';

export default function VehicleOrdersModal({ isOpen, onClose, vehicle }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && vehicle) {
      setLoading(true);
      vehicleApi.getVehicleOrders(vehicle.id)
        .then((res) => {
          if (res.data) setOrders(res.data);
        })
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen, vehicle]);

  if (!vehicle) return null;

  const totalAssignedWeight = orders.reduce((sum, o) => sum + (o.packageWeight || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Orders Assigned to ${vehicle.vehicleNumber} (${vehicle.model})`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Vehicle Summary Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-800" />
            <span className="font-semibold text-amber-900">Driver: {vehicle.driverName || 'Unassigned'} ({vehicle.driverContact || 'N/A'})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600">
              Payload: <strong className="text-ups-brown">{totalAssignedWeight.toFixed(1)} / {vehicle.maxCapacityKg} kg</strong>
            </span>
            <span className="text-gray-600">
              Remaining: <strong className="text-emerald-700">{Math.max(0, vehicle.maxCapacityKg - totalAssignedWeight).toFixed(1)} kg</strong>
            </span>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching assigned deliveries..." />
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium">No orders currently assigned to this carrier.</p>
            <p className="text-xs text-gray-400 mt-0.5">Use the Route Planning or Orders module to allocate shipments.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Order ID</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3 text-right">Weight</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-ups-brown font-mono">
                      {o.orderId}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-800">{o.customerName}</div>
                      <div className="text-[10px] text-gray-400">{o.customerContact}</div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs truncate text-gray-600" title={o.destinationAddress}>
                      <MapPin className="w-3 h-3 inline mr-1 text-gray-400" />
                      {o.destinationAddress}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-gray-800">
                      {o.packageWeight} kg
                    </td>
                    <td className="py-2.5 px-3">
                      <PriorityBadge priority={o.priority} />
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
