import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchModels } from '../actions/modelActions';
import ModelCard from './ModelCard';

const ModelLibrary = () => {
  const dispatch = useDispatch();
  const models = useSelector((state) => state.models);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  useEffect(() => {
    const filtered = models.filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredModels(filtered);
  }, [models, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="model-library">
      <h2>3D Model Library</h2>
      <input
        type="search"
        placeholder="Search models"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="model-grid">
        {filteredModels.map((model) => (
          <ModelCard key={model._id} model={model} />
        ))}
      </div>
    </div>
  );
};

export default ModelLibrary;
```

```javascript
// src/actions/modelActions.js
import axios from 'axios';

export const fetchModels = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get('/api/models');
      dispatch({ type: 'FETCH_MODELS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_MODELS_ERROR', payload: error.message });
    }
  };
};
```

```javascript
// src/reducers/modelReducer.js
const initialState = {
  models: [],
  error: null,
};

const modelReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_MODELS_SUCCESS':
      return { ...state, models: action.payload };
    case 'FETCH_MODELS_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default modelReducer;
```

```javascript
// src/components/ModelCard.js
import React from 'react';

const ModelCard = ({ model }) => {
  return (
    <div className="model-card">
      <h3>{model.name}</h3>
      <p>{model.description}</p>
      <img src={model.thumbnail} alt={model.name} />
    </div>
  );
};

export default ModelCard;
```

```javascript
// src/pages/api/models.js
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

const getModels = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    const db = client.db();
    const modelsCollection = db.collection('models');
    const models = await modelsCollection.find().toArray();
    res.json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching models' });
  } finally {
    await client.close();
  }
};

export default getModels;