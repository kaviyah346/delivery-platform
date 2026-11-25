import api from './client';

export const reportApi = {
  getAnalyticsReport: () => {
    return api.get('/reports/analytics');
  },

  getTrackingMilestones: (orderId) => {
    return api.get(`/reports/tracking/${encodeURIComponent(orderId)}`);
  },
};
