import apiClient from './api';

export const createGame = async () => {
  const { data } = await apiClient.post('/api/games');
  return data;
};

export const getRandomLocations = async (count = 5) => {
  const { data } = await apiClient.get(`/api/locations/random?count=${count}`);
  return data;
};

export const submitRound = async (gameId, roundData) => {
  const { data } = await apiClient.post(`/api/games/${gameId}/rounds`, roundData);
  return data;
};

export const completeGame = async (gameId) => {
  const { data } = await apiClient.post(`/api/games/${gameId}/complete`);
  return data;
};