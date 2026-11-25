import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { vehicleApi } from '../../api/vehicleApi';
import { Route, MapPin, Gauge, Clock, Truck } from 'lucide-react';

export default function RouteModal({ isOpen, onClose, onSave, route, isSaving }) {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    routeCode: '',
    origin: '',
    destination: '',
    totalDistanceKm: '',
    estimatedDurationHours: '',
    status: 'PLANNED',
    vehicleId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      vehicleApi.getAllVehicles().then((res) => {
        if (res.data) setVehicles(res.data);
      });

      if (route) {
        setFormData({
          routeCode: route.routeCode || '',
          origin: route.origin || '',
          destination: route.destination || '',
          totalDistanceKm: route.totalDistanceKm || '',
          estimatedDurationHours: route.estimatedDurationHours || '',
          status: route.status || 'PLANNED',
          vehicleId: route.vehicleId || '',
        });
      } else {
        setFormData({
          routeCode: '',
          origin: '',
          destination: '',
          totalDistanceKm: '',
          estimatedDurationHours: '',
          status: 'PLANNED',
          vehicleId: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, route]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.origin.trim()) errs.origin = 'Origin hub / depot is required';
    if (!formData.destination.trim()) errs.destination = 'Destination is required';
    if (!formData.totalDistanceKm || Number(formData.totalDistanceKm) <= 0) {
      errs.totalDistanceKm = 'Distance must be greater than 0 km';
    }
    if (!formData.estimatedDurationHours || Number(formData.estimatedDurationHours) <= 0) {
      errs.estimatedDurationHours = 'Estimated duration must be greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...formData,
      totalDistanceKm: parseFloat(formData.totalDistanceKm),
      estimatedDurationHours: parseFloat(formData.estimatedDurationHours),
      vehicleId: formData.vehicleId ? parseInt(formData.vehicleId, 10) : null,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={route ? `Edit Route ${route.routeCode}` : 'Create Delivery Transit Route'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Route Code */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Route Code
          </label>
          <div className="relative">
            <Route className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              name="routeCode"
              value={formData.routeCode}
              onChange={handleChange}
              disabled={!!route}
              placeholder="e.g. RT-1005 (leave blank to auto-generate)"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        </div>

        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ups-text-dark mb-1">
              Origin Depot / Hub <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Central Logistics Depot"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
              />
            </div>
            {errors.origin && <p className="text-xs text-rose-500 mt-1">{errors.origin}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ups-text-dark mb-1">
              Destination City / Terminal <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-3" />
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. North Metro Terminal"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
              />
            </div>
            {errors.destination && <p className="text-xs text-rose-500 mt-1">{errors.destination}</p>}
          </div>
        </div>

        {/* Distance & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ups-text-dark mb-1">
              Total Distance (km) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Gauge className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="number"
                step="0.1"
                min="0.5"
                name="totalDistanceKm"
                value={formData.totalDistanceKm}
                onChange={handleChange}
                placeholder="e.g. 48.5"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
              />
            </div>
            {errors.totalDistanceKm && <p className="text-xs text-rose-500 mt-1">{errors.totalDistanceKm}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ups-text-dark mb-1">
              Estimated Duration (Hours) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="number"
                step="0.1"
                min="0.1"
                name="estimatedDurationHours"
                value={formData.estimatedDurationHours}
                onChange={handleChange}
                placeholder="e.g. 1.8"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold"
              />
            </div>
            {errors.estimatedDurationHours && <p className="text-xs text-rose-500 mt-1">{errors.estimatedDurationHours}</p>}
          </div>
        </div>

        {/* Vehicle Assignment */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Assign Carrier Vehicle
          </label>
          <div className="relative">
            <Truck className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold bg-white"
            >
              <option value="">No Vehicle Assigned (Unallocated)</option>
              {vehicles.map((v) => {
                const free = Math.max(0, v.maxCapacityKg - v.currentLoadKg);
                return (
                  <option key={v.id} value={v.id} disabled={v.status === 'MAINTENANCE'}>
                    {v.vehicleNumber} ({v.model}) — Free: {free.toFixed(0)} kg / Max: {v.maxCapacityKg} kg {v.status === 'MAINTENANCE' ? '[Maintenance]' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-ups-text-dark mb-1">
            Route Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ups-gold bg-white"
          >
            <option value="PLANNED">PLANNED - Scheduled corridor</option>
            <option value="IN_PROGRESS">IN_PROGRESS - Transit active</option>
            <option value="COMPLETED">COMPLETED - All shipments delivered</option>
            <option value="DELAYED">DELAYED - Transit delayed</option>
          </select>
        </div>

        {/* Actions */}
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
            {isSaving ? 'Saving...' : route ? 'Update Route' : 'Create Route'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
