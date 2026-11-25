import api from './client';

export const chatbotApi = {
  sendQuery: (message, sessionId = 'default-session') => {
    return api.post('/chatbot/query', { message, sessionId });
  },
};
