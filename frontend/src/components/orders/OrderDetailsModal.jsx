import React from 'react';
import Modal from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Truck, 
  Scale, 
  FileText, 
  Clock,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

export default function OrderDetailsModal({ isOpen, onClose, order, onEdit }) {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delivery Order Details - ${order.orderId ? order.orderId.replace(/^UPS-/, '') : ''}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Top summary card */}
        <div className="p-4 rounded-xl bg-ups-brown text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-ups-gold text-ups-brown flex items-center justify-center font-bold text-xl shadow">
              <Package className="w-6 h-6 text-ups-brown" />
            </div>
            <div>
              <p className="text-xs text-ups-gold uppercase tracking-wider font-semibold">
                Express Delivery Shipment
              </p>
              <h4 className="text-xl font-extrabold tracking-tight">
                {order.orderId ? order.orderId.replace(/^UPS-/, '') : ''}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
          </div>
        </div>

        {/* Customer & Route Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <div className="p-4 rounded-xl border border-ups-gray-border bg-ups-gray-bg/40">
            <h5 className="text-xs font-bold uppercase tracking-wider text-ups-brown mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-ups-gold" />
              Customer Information
            </h5>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-xs text-ups-text-muted block">Client / Organization:</span>
                <span className="font-semibold text-ups-text-dark">{order.customerName}</span>
              </div>
              <div>
                <span className="text-xs text-ups-text-muted block">Contact Phone / Email:</span>
                <span className="font-semibold text-ups-text-dark flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-ups-text-muted" />
                  {order.customerContact}
                </span>
              </div>
            </div>
          </div>

          {/* Package & Date Card */}
          <div className="p-4 rounded-xl border border-ups-gray-border bg-ups-gray-bg/40">
            <h5 className="text-xs font-bold uppercase tracking-wider text-ups-brown mb-3 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-ups-gold" />
              Cargo Specifications
            </h5>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-xs text-ups-text-muted block">Package Weight:</span>
                <span className="text-lg font-black text-ups-brown">
                  {order.packageWeight ? order.packageWeight.toFixed(1) : '0.0'} kg
                </span>
              </div>
              <div>
                <span className="text-xs text-ups-text-muted block">Order Date:</span>
                <span className="font-semibold text-ups-text-dark flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-ups-text-muted" />
                  {order.orderDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses Routing Card */}
        <div className="p-4 rounded-xl border border-ups-gray-border bg-white space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-ups-brown mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-ups-gold" />
            Route Origin & Destination
          </h5>

          <div className="relative pl-6 pb-4 border-l-2 border-blue-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
              A
            </div>
            <p className="text-xs text-ups-text-muted uppercase font-bold">Pickup Origin</p>
            <p className="text-sm font-semibold text-ups-text-dark mt-0.5">{order.pickupAddress}</p>
          </div>

          <div className="relative pl-6 border-l-2 border-rose-500">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">
              B
            </div>
            <p className="text-xs text-ups-text-muted uppercase font-bold">Delivery Destination</p>
            <p className="text-sm font-semibold text-ups-text-dark mt-0.5">{order.destinationAddress}</p>
          </div>
        </div>

        {/* Vehicle & Logistics Assignment */}
        <div className="p-4 rounded-xl border border-ups-gray-border bg-ups-gray-bg/40">
          <h5 className="text-xs font-bold uppercase tracking-wider text-ups-brown mb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-ups-gold" />
            Fleet & Vehicle Allocation
          </h5>
          {order.vehicleNumber ? (
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-bold text-ups-text-dark">{order.vehicleNumber.replace(/^UPS-/, '')}</span>
                <span className="text-xs text-ups-text-muted ml-2">Assigned carrier</span>
              </div>
              {order.routeCode && (
                <span className="text-xs font-mono bg-ups-gold/20 text-ups-brown px-2 py-1 rounded">
                  Route: {order.routeCode}
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-ups-text-muted italic">
              No vehicle allocated yet. Ready to be scheduled in the Fleet & Capacity Management module.
            </p>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
            <span className="font-bold text-amber-900 block mb-0.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> Special Handling Notes:
            </span>
            <p className="text-amber-900">{order.notes}</p>
          </div>
        )}

        {/* Timestamps & Actions */}
        <div className="pt-4 border-t border-ups-gray-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ups-text-muted">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Persisted in PostgreSQL database (Record ID: #{order.id})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-ups-gray-border text-sm font-medium text-ups-text-dark hover:bg-ups-gray-bg transition-colors"
            >
              Close
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(order);
                }}
                className="px-4 py-2 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-sm shadow-sm transition-colors"
              >
                Edit Order
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
