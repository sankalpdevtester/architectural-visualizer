import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadModel } from '../models/index';
import { setModel } from '../features/model-library/model-library';
import { auth } from '../features/auth/auth';
import axios from 'axios';
import { useRouter } from 'next/router';

const ModelUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('model', file);

      const response = await axios.post('/api/models', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const model = response.data;
      dispatch(setModel(model));
      router.push(`/models/${model._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload 3D Model</h1>
      <input type="file" onChange={handleFileChange} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default ModelUpload;
```

```javascript
// src/api/models.js
import express from 'express';
import multer from 'multer';
import { uploadModel } from '../models/index';
import { auth } from '../features/auth/auth';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('model'), async (req, res) => {
  try {
    const model = await uploadModel(req.file, req.user);
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
```

```javascript
// src/models/index.js
import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  name: String,
  file: String,
  userId: String,
});

const Model = mongoose.model('Model', modelSchema);

const uploadModel = async (file, user) => {
  const model = new Model({
    name: file.originalname,
    file: file.path,
    userId: user._id,
  });

  await model.save();
  return model;
};

export { uploadModel };