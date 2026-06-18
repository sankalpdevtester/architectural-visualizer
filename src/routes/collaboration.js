import express from 'express';
import { Router } from 'express';
import { getModel } from '../features/model-library/model-library';
import { updateModel } from '../features/model-editing/model-editing';
import { io } from 'socket.io-client';

const router = Router();
const socket = io('http://localhost:3001');

router.post('/comments', (req, res) => {
  const { comment, modelId } = req.body;
  const model = getModel(modelId);
  if (!model) {
    return res.status(404).send({ message: 'Model not found' });
  }
  socket.emit('newComment', { comment, modelId });
  res.send({ message: 'Comment added successfully' });
});

router.delete('/comments/:commentId', (req, res) => {
  const { commentId, modelId } = req.params;
  const model = getModel(modelId);
  if (!model) {
    return res.status(404).send({ message: 'Model not found' });
  }
  socket.emit('deleteComment', { commentId, modelId });
  res.send({ message: 'Comment deleted successfully' });
});

export default router;