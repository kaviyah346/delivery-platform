import api from './client';

export const routeApi = {
  getAllRoutes: (params = {}) => {
    return api.get('/routes', { params });
  },

  getRouteById: (id) => {
    return api.get(`/routes/${id}`);
  },

  createRoute: (data) => {
    return api.post('/routes', data);
  },

  updateRoute: (id, data) => {
    return api.put(`/routes/${id}`, data);
  },

  deleteRoute: (id) => {
    return api.delete(`/routes/${id}`);
  },

  assignOrdersToRoute: (routeId, orderIds) => {
    return api.post(`/routes/${routeId}/assign-orders`, { orderIds });
  },

  autoAllocateOrders: () => {
    return api.post('/routes/auto-allocate');
  },
};
