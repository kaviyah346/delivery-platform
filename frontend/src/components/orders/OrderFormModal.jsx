import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { vehicleApi } from '../../api/vehicleApi';
import { AlertCircle, Truck, PackageCheck, AlertTriangle } from 'lucide-react';

export default function OrderFormModal({
  isOpen,
  onClose,
  onSubmit,
  order = null, // null for new, order object for edit
  isSubmitting = false,
  serverErrors = null,
}) {
  const isEdit = Boolean(order);

  const [formData, setFormData] = useState({
    orderId: '',
    customerName: '',
    customerContact: '',
    pickupAddress: '',
    destinationAddress: '',
    packageWeight: '',
    priority: 'MEDIUM',
    orderDate: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    vehicleId: '',
    notes: '',
  });

  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [capacityWarning, setCapacityWarning] = useState(null);

  // Fetch available vehicles for assignment dropdown
  useEffect(() => {
    if (isOpen) {
      vehicleApi.getAllVehicles()
        .then((res) => {
          if (res.data) setVehicles(res.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Populate form if editing
  useEffect(() => {
    if (order) {
      setFormData({
        orderId: order.orderId || '',
        customerName: order.customerName || '',
        customerContact: order.customerContact || '',
        pickupAddress: order.pickupAddress || '',
        destinationAddress: order.destinationAddress || '',
        packageWeight: order.packageWeight !== undefined ? order.packageWeight : '',
        priority: order.priority || 'MEDIUM',
        orderDate: order.orderDate || new Date().toISOString().split('T')[0],
        status: order.status || 'PENDING',
        vehicleId: order.vehicleId || '',
        notes: order.notes || '',
      });
    } else {
      setFormData({
        orderId: '',
        customerName: '',
        customerContact: '',
        pickupAddress: '',
        destinationAddress: '',
        packageWeight: '',
        priority: 'MEDIUM',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        vehicleId: '',
        notes: '',
      });
    }
    setErrors({});
    setCapacityWarning(null);
  }, [order, isOpen]);

  // Set server errors if any
  useEffect(() => {
    if (serverErrors) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  // Check vehicle capacity interactively
  useEffect(() => {
    if (!formData.vehicleId || !formData.packageWeight) {
      setCapacityWarning(null);
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id.toString() === formData.vehicleId.toString());
    if (selectedVehicle) {
      const weight = parseFloat(formData.packageWeight) || 0;
      // If editing this order, subtract original weight if it was already on this vehicle
      const existingLoad = (isEdit && order?.vehicleId === selectedVehicle.id)
        ? Math.max(0, selectedVehicle.currentLoadKg - (order.packageWeight || 0))
        : selectedVehicle.currentLoadKg;

      const projected = existingLoad + weight;
      if (projected > selectedVehicle.maxCapacityKg) {
        setCapacityWarning({
          type: 'danger',
          message: `Exceeds Vehicle Capacity! Vehicle max: ${selectedVehicle.maxCapacityKg} kg. Current: ${existingLoad.toFixed(1)} kg. Adding ${weight} kg = ${projected.toFixed(1)} kg.`,
        });
      } else {
        setCapacityWarning({
          type: 'info',
          message: `Vehicle ${selectedVehicle.vehicleNumber}: ${projected.toFixed(1)} / ${selectedVehicle.maxCapacityKg} kg utilized (${((projected / selectedVehicle.maxCapacityKg) * 100).toFixed(1)}%).`,
        });
      }
    }
  }, [formData.vehicleId, formData.packageWeight, vehicles, isEdit, order]);

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is mandatory';
    }

    if (!formData.customerContact.trim()) {
      newErrors.customerContact = 'Customer contact number is mandatory';
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.customerContact.trim())) {
      newErrors.customerContact = 'Please enter a valid phone number (7-20 digits)';
    }

    if (!formData.pickupAddress.trim()) {
      newErrors.pickupAddress = 'Pickup address is mandatory';
    }

    if (!formData.destinationAddress.trim()) {
      newErrors.destinationAddress = 'Destination address is mandatory';
    }

    const weightNum = parseFloat(formData.packageWeight);
    if (!formData.packageWeight || isNaN(weightNum)) {
      newErrors.packageWeight = 'Package weight is mandatory';
    } else if (weightNum <= 0) {
      newErrors.packageWeight = 'Package weight must be greater than zero kg';
    }

    if (!formData.orderDate) {
      newErrors.orderDate = 'Order date is mandatory';
    }

    if (capacityWarning?.type === 'danger') {
      newErrors.vehicleId = 'Selected vehicle capacity would be exceeded by this package';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      packageWeight: parseFloat(formData.packageWeight),
      vehicleId: formData.vehicleId ? parseInt(formData.vehicleId, 10) : null,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Order - ${order.orderId ? order.orderId.replace(/^UPS-/, '') : ''}` : 'Create New Delivery Order'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order ID banner */}
        <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-ups-brown font-medium">
            <PackageCheck className="w-4 h-4 text-ups-gold" />
            <span>
              {isEdit ? (
                <>Tracking ID: <strong className="font-mono text-ups-brown">{formData.orderId ? formData.orderId.replace(/^UPS-/, '') : ''}</strong></>
              ) : (
                <>Order ID will be automatically generated (e.g. <span className="font-mono font-bold">ORD-XXXX</span>)</>
              )}
            </span>
          </div>
          <span className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">
            PostgreSQL Synchronized
          </span>
        </div>

        {/* Customer Information Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              placeholder="e.g. Acme Industrial Supplies"
              className={`w-full px-3.5 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent transition ${
                errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-ups-gray-border'
              }`}
            />
            {errors.customerName && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.customerName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Customer Contact <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerContact}
              onChange={(e) => setFormData({ ...formData, customerContact: e.target.value })}
              placeholder="e.g. +1-404-555-0199"
              className={`w-full px-3.5 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent transition ${
                errors.customerContact ? 'border-rose-400 bg-rose-50/30' : 'border-ups-gray-border'
              }`}
            />
            {errors.customerContact && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.customerContact}
              </p>
            )}
          </div>
        </div>

        {/* Addresses Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Pickup Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="2"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
              placeholder="Full pickup facility or origin address"
              className={`w-full px-3.5 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent transition resize-none ${
                errors.pickupAddress ? 'border-rose-400 bg-rose-50/30' : 'border-ups-gray-border'
              }`}
            />
            {errors.pickupAddress && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.pickupAddress}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Destination Address <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="2"
              value={formData.destinationAddress}
              onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
              placeholder="Full delivery destination address"
              className={`w-full px-3.5 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent transition resize-none ${
                errors.destinationAddress ? 'border-rose-400 bg-rose-50/30' : 'border-ups-gray-border'
              }`}
            />
            {errors.destinationAddress && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.destinationAddress}
              </p>
            )}
          </div>
        </div>

        {/* Weight, Priority, Order Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Package Weight (kg) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.packageWeight}
                onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                placeholder="e.g. 25.5"
                className={`w-full pl-3.5 pr-8 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold focus:border-transparent transition ${
                  errors.packageWeight ? 'border-rose-400 bg-rose-50/30' : 'border-ups-gray-border'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ups-text-muted font-bold pointer-events-none">
                kg
              </span>
            </div>
            {errors.packageWeight && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.packageWeight}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Delivery Priority <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-ups-gray-bg border border-ups-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold font-medium"
            >
              <option value="HIGH">High Priority (Urgent)</option>
              <option value="MEDIUM">Medium Priority (Standard)</option>
              <option value="LOW">Low Priority (Economy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Order Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={formData.orderDate}
              onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
              className={`w-full px-3.5 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold ${
                errors.orderDate ? 'border-rose-400' : 'border-ups-gray-border'
              }`}
            />
            {errors.orderDate && (
              <p className="text-xs text-rose-500 mt-1">{errors.orderDate}</p>
            )}
          </div>
        </div>

        {/* Status & Vehicle Assignment Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Delivery Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-ups-gray-bg border border-ups-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold font-medium"
            >
              <option value="PENDING">Pending (Awaiting Allocation)</option>
              <option value="ASSIGNED">Assigned (Vehicle Assigned)</option>
              <option value="IN_TRANSIT">In Transit (Out for Delivery)</option>
              <option value="DELIVERED">Delivered (Completed)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
              Vehicle Capacity Allocation (Optional)
            </label>
            <select
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              className={`w-full px-3.5 py-2 text-sm bg-ups-gray-bg border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold font-medium ${
                errors.vehicleId ? 'border-rose-400' : 'border-ups-gray-border'
              }`}
            >
              <option value="">-- Unassigned (Assign Later) --</option>
              {vehicles.map((v) => {
                const isAvail = v.status !== 'MAINTENANCE';
                return (
                  <option 
                    key={v.id} 
                    value={v.id}
                    disabled={!isAvail}
                  >
                    {v.vehicleNumber.replace(/^UPS-/, '')} ({v.model}) - Max {v.maxCapacityKg}kg [Current: {v.currentLoadKg}kg] {v.status === 'MAINTENANCE' ? '(Under Maintenance)' : ''}
                  </option>
                );
              })}
            </select>
            {errors.vehicleId && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.vehicleId}
              </p>
            )}
          </div>
        </div>

        {/* Real-time Vehicle Capacity Warning / Info */}
        {capacityWarning && (
          <div className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            capacityWarning.type === 'danger'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {capacityWarning.type === 'danger' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span className="font-medium">{capacityWarning.message}</span>
          </div>
        )}

        {/* Special Instructions / Notes */}
        <div>
          <label className="block text-xs font-bold text-ups-text-dark uppercase tracking-wider mb-1">
            Special Handling Instructions & Notes (Optional)
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Fragile optical equipment. Signature required on delivery."
            className="w-full px-3.5 py-2 text-sm bg-ups-gray-bg border border-ups-gray-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-ups-gray-border">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-ups-gray-border text-sm font-medium text-ups-text-dark hover:bg-ups-gray-bg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || capacityWarning?.type === 'danger'}
            className="px-5 py-2 rounded-lg bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-bold text-sm shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEdit ? 'Update Delivery Order' : 'Create Delivery Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
