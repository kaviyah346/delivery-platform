import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Truck, Scale, User, Phone, AlertCircle } from 'lucide-react';

export default function VehicleModal({ isOpen, onClose, onSave, vehicle, isSaving }) {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    model: '',
    maxCapacityKg: '',
    driverName: '',
    driverContact: '',
    status: 'AVAILABLE',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleNumber: vehicle.vehicleNumber || '',
        model: vehicle.model || '',
        maxCapacityKg: vehicle.maxCapacityKg || '',
        driverName: vehicle.driverName || '',
        driverContact: vehicle.driverContact || '',
        status: vehicle.status || 'AVAILABLE',
      });
    } else {
      setFormData({
        vehicleNumber: '',
        model: '',
        maxCapacityKg: '',
        driverName: '',
        driverContact: '',
        status: 'AVAILABLE',
      });
    }
    setErrors({});
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.model.trim()) errs.model = 'Vehicle model is required';
    if (!formData.maxCapacityKg || Number(formData.maxCapacityKg) < 50) {
      errs.maxCapacityKg = 'Maximum payload capacity must be at least 50 kg';
    }
    if (vehicle && Number(formData.maxCapacityKg) < vehicle.currentLoadKg) {
      errs.maxCapacityKg = `Cannot set max capacity below current active load (${vehicle.currentLoadKg} kg)`;
    }
    if (!formData.driverName.trim()) errs.driverName = 'Driver name is required';
    if (!formData.driverContact.trim()) errs.driverContact = 'Driver contact is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      maxCapacityKg: parseFloat(formData.maxCapacityKg),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? `Edit Vehicle ${vehicle.vehicleNumber}` : 'Add New Fleet Vehicle'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Number (optional/custom) */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Vehicle Number / ID
          </label>
          <div className="relative">
            <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleChange}
              disabled={!!vehicle}
              placeholder="e.g. V-107 (leave blank for auto-generate)"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
          {errors.vehicleNumber && (
            <p className="text-xs text-rose-500 mt-1">{errors.vehicleNumber}</p>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Vehicle Model <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Mercedes Sprinter Cargo Van / Ford Transit Heavy"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
          />
          {errors.model && (
            <p className="text-xs text-rose-500 mt-1">{errors.model}</p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Maximum Payload Capacity (kg) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Scale className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="number"
              step="1"
              min="50"
              name="maxCapacityKg"
              value={formData.maxCapacityKg}
              onChange={handleChange}
              placeholder="e.g. 1500"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
            />
          </div>
          {errors.maxCapacityKg && (
            <p className="text-xs text-rose-500 mt-1">{errors.maxCapacityKg}</p>
          )}
          {vehicle && (
            <p className="text-[11px] text-gray-500 mt-1">
              Current active payload: <strong className="text-ups-brown">{vehicle.currentLoadKg} kg</strong>
            </p>
          )}
        </div>

        {/* Driver Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ups-text-dark mb-1">
              Assigned Driver Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="e.g. Robert Davis"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
              />
            </div>
            {errors.driverName && (
              <p className="text-xs text-rose-500 mt-1">{errors.driverName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ups-text-dark mb-1">
              Driver Contact Phone <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                name="driverContact"
                value={formData.driverContact}
                onChange={handleChange}
                placeholder="e.g. +1-404-555-0199"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
              />
            </div>
            {errors.driverContact && (
              <p className="text-xs text-rose-500 mt-1">{errors.driverContact}</p>
            )}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Vehicle Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold bg-white"
          >
            <option value="AVAILABLE">AVAILABLE - Ready for dispatch</option>
            <option value="OCCUPIED">OCCUPIED - Carrying cargo</option>
            <option value="MAINTENANCE">MAINTENANCE - In inspection/service</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-sm font-bold text-ups-brown bg-ups-gold hover:bg-ups-gold-hover rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : vehicle ? 'Save Changes' : 'Register Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
