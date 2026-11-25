import React from 'react';
import { Eye, Edit3, Trash2, ArrowRight, Truck, MapPin, Package } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';

export default function OrderTable({
  orders,
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-ups-gray-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ups-brown text-white text-[11px] uppercase tracking-wider font-semibold border-b border-ups-brown-light">
              <th className="py-3.5 px-4">Order ID</th>
              <th className="py-3.5 px-4">Customer Details</th>
              <th className="py-3.5 px-4">Route (Pickup &rarr; Destination)</th>
              <th className="py-3.5 px-4">Weight</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Order Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ups-gray-border text-xs sm:text-sm">
            {orders.map((order, idx) => (
              <tr 
                key={order.id} 
                className={`hover:bg-amber-50/40 transition-colors ${idx % 2 === 1 ? 'bg-ups-gray-bg/40' : 'bg-white'}`}
              >
                {/* Order ID */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-ups-gold/20 text-ups-brown flex items-center justify-center font-bold text-[11px]">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => onView(order)}
                        className="font-bold text-ups-brown hover:text-amber-800 hover:underline tracking-tight"
                      >
                        {order.orderId ? order.orderId.replace(/^UPS-/, '') : ''}
                      </button>
                      {order.vehicleNumber && (
                        <div className="flex items-center gap-1 text-[11px] text-ups-text-muted mt-0.5">
                          <Truck className="w-3 h-3 text-ups-gold" />
                          <span>{order.vehicleNumber.replace(/^UPS-/, '')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Customer Details */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-ups-text-dark">
                    {order.customerName}
                  </div>
                  <div className="text-[11px] text-ups-text-muted">
                    {order.customerContact}
                  </div>
                </td>

                {/* Route */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1.5 text-ups-text-dark font-medium truncate" title={order.pickupAddress}>
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <span className="truncate">{order.pickupAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-ups-text-muted truncate" title={order.destinationAddress}>
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="truncate">{order.destinationAddress}</span>
                    </div>
                  </div>
                </td>

                {/* Package Weight */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-bold text-ups-text-dark">
                    {order.packageWeight ? order.packageWeight.toFixed(1) : '0.0'}
                  </span>
                  <span className="text-xs text-ups-text-muted ml-1">kg</span>
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <PriorityBadge priority={order.priority} />
                </td>

                {/* Order Date */}
                <td className="py-3.5 px-4 whitespace-nowrap text-xs text-ups-text-muted font-medium">
                  {order.orderDate}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(order)}
                      title="View Details"
                      className="p-1.5 rounded-lg text-ups-text-muted hover:text-ups-brown hover:bg-ups-gray-hover transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(order)}
                      title="Edit Order"
                      className="p-1.5 rounded-lg text-ups-text-muted hover:text-amber-800 hover:bg-amber-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(order)}
                      title="Delete Order"
                      className="p-1.5 rounded-lg text-ups-text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
