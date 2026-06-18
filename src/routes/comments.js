import express from 'express';
import { addComment, getComments } from '../api/comments';
import { Comment } from '../models/index';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

router.get('/:modelId', async (req, res) => {
  try {
    const comments = await Comment.find({ modelId: req.params.modelId });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting comments' });
  }
});

export default router;