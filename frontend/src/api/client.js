import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://delivery-platform-x3c6.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let validationErrors = null;

    if (error.response) {
      if (error.response.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data;
        } else {
          message = error.response.data.message || error.response.data.error || message;
          validationErrors = error.response.data.validationErrors || null;
        }
      }
    } else if (error.request) {
      message = 'Cannot connect to backend server. Ensure Spring Boot is running on port 8080 or live API is active.';
    }

    const customError = new Error(message);
    customError.validationErrors = validationErrors;
    customError.status = error.response ? error.response.status : null;
    return Promise.reject(customError);
  }
);

export default api;
