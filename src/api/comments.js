import axios from 'axios';
import { apiUrl } from '../config/index';

const addComment = async (modelId, text, userId) => {
  try {
    const response = await axios.post(`${apiUrl}/comments`, {
      modelId,
      text,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getComments = async (modelId) => {
  try {
    const response = await axios.get(`${apiUrl}/comments/${modelId}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { addComment, getComments };