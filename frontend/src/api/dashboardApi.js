import api from './client';

export const dashboardApi = {
  getDashboardStats: () => {
    return api.get('/dashboard/stats');
  },

  getTotalOrders: () => {
    return api.get('/dashboard/total-orders');
  },

  getStatusDistribution: () => {
    return api.get('/dashboard/status-distribution');
  },

  getVehicleStats: () => {
    return api.get('/dashboard/vehicle-stats');
  },

  getRecentOrders: (limit = 6) => {
    return api.get('/dashboard/recent-orders', { params: { limit } });
  },
};
