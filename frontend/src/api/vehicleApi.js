import api from './client';

export const vehicleApi = {
  getAllVehicles: () => {
    return api.get('/vehicles');
  },

  getVehicleById: (id) => {
    return api.get(`/vehicles/${id}`);
  },

  createVehicle: (data) => {
    return api.post('/vehicles', data);
  },

  updateVehicle: (id, data) => {
    return api.put(`/vehicles/${id}`, data);
  },

  deleteVehicle: (id) => {
    return api.delete(`/vehicles/${id}`);
  },

  toggleMaintenance: (id) => {
    return api.post(`/vehicles/${id}/maintenance`);
  },

  getVehicleOrders: (id) => {
    return api.get(`/vehicles/${id}/orders`);
  },
};
