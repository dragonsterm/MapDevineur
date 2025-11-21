import api from './api';

export const getRandomLocations = async () => {
  const response = await api.get('/api/locations/random');
  return response.data;
};

export const createGame = async () => {
  const response = await api.post('/api/games');
  return response.data;
};

export const submitRound = async (gameId, roundData) => {
  const response = await api.post(`/api/games/${gameId}/rounds`, roundData);
  return response.data;
};

export const completeGame = async (gameId) => {
  const response = await api.post(`/api/games/${gameId}/complete`);
  return response.data;
};