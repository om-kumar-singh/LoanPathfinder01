import axios from 'axios';

const mlClient = axios.create({
  baseURL: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  timeout: 10000
});

export const getPrediction = async (profile) => {
  const { data } = await mlClient.post('/predict', profile);
  return data;
};

export const getSimulation = async (profile, adjustments) => {
  const { data } = await mlClient.post('/simulate', { profile, adjustments });
  return data;
};
