import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { modelEditingActions } from '../model-editing/model-editing.js';
import { authActions } from '../auth/auth.js';
import { modelLibraryActions } from '../model-library/model-library.js';
import { furnitureLibraryActions } from './furniture-library.js';
import { config } from '../../config/index.js';
import { modelActions } from '../../models/index.js';

const FurnitureLibrary = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { models } = useSelector((state) => state.modelLibrary);
  const { furniture } = useSelector((state) => state.furnitureLibrary);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      dispatch(modelLibraryActions.fetchModels());
      dispatch(furnitureLibraryActions.fetchFurniture());
    }
  }, [user, dispatch, router]);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    dispatch(modelEditingActions.selectModel(model));
  };

  const handleFurnitureSelect = (furnitureItem) => {
    setSelectedFurniture(furnitureItem);
    dispatch(modelEditingActions.addFurnitureToModel(furnitureItem));
  };

  const handleFurnitureDelete = (furnitureId) => {
    dispatch(furnitureLibraryActions.deleteFurniture(furnitureId));
  };

  const handleFurnitureCreate = (newFurniture) => {
    dispatch(furnitureLibraryActions.createFurniture(newFurniture));
  };

  const handleFurnitureUpdate = (updatedFurniture) => {
    dispatch(furnitureLibraryActions.updateFurniture(updatedFurniture));
  };

  return (
    <div>
      <h1>Furniture Library</h1>
      <ul>
        {furniture.map((furnitureItem) => (
          <li key={furnitureItem._id}>
            {furnitureItem.name}
            <button onClick={() => handleFurnitureSelect(furnitureItem)}>Select</button>
            <button onClick={() => handleFurnitureDelete(furnitureItem._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form>
        <input type="text" placeholder="Furniture name" />
        <input type="text" placeholder="Furniture description" />
        <button onClick={handleFurnitureCreate}>Create Furniture</button>
      </form>
      {selectedFurniture && (
        <div>
          <h2>Selected Furniture: {selectedFurniture.name}</h2>
          <form>
            <input type="text" value={selectedFurniture.name} />
            <input type="text" value={selectedFurniture.description} />
            <button onClick={handleFurnitureUpdate}>Update Furniture</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FurnitureLibrary;