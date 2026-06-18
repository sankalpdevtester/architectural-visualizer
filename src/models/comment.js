import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: String,
  modelId: String,
  userId: String,
  createdAt: Date,
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;