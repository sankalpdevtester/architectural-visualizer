import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { updateModel } from '../model-editing/model-editing';
import { getModel } from '../model-library/model-library';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const Collaboration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const model = useSelector((state) => state.model);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket.io server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket.io server');
    });

    socket.on('newComment', (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newComment');
    };
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    socket.emit('newComment', { comment: newComment, modelId: id });
    setNewComment('');
  };

  const handleCommentDelete = (commentId) => {
    socket.emit('deleteComment', { commentId, modelId: id });
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };

  return (
    <div>
      <h2>Collaboration</h2>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.text}
            <button onClick={() => handleCommentDelete(comment.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Collaboration;