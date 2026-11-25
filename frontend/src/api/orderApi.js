import api from './client';

export const orderApi = {
  getAllOrders: (params = {}) => {
    const cleanParams = {};
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.status && params.status !== 'ALL') cleanParams.status = params.status;
    if (params.priority && params.priority !== 'ALL') cleanParams.priority = params.priority;
    return api.get('/orders', { params: cleanParams });
  },

  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },

  getOrderByTracking: (orderId) => {
    return api.get(`/orders/tracking/${orderId}`);
  },

  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  updateOrder: (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },

  deleteOrder: (id) => {
    return api.delete(`/orders/${id}`);
  },
};
