import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addComment, getComments } from '../api/comments';
import { selectModel } from '../features/model-editing/model-editing';
import { selectUser } from '../features/auth/auth';

const Collaboration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const modelId = router.query.modelId;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const model = useSelector(selectModel);
  const user = useSelector(selectUser);

  useEffect(() => {
    getComments(modelId).then((comments) => setComments(comments));
  }, [modelId]);

  const handleAddComment = () => {
    addComment(modelId, newComment, user.id).then((comment) => {
      setComments([...comments, comment]);
      setNewComment('');
    });
  };

  return (
    <div>
      <h2>Collaboration</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <p>By {comment.user.name}</p>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
};

export default Collaboration;