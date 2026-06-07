import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFurniture, removeFurniture, updateFurniture } from '../model-editing/model-editing.slice';
import { selectFurniture } from '../model-editing/model-editing.selectors';
import { fetchFurniture } from '../api/furniture.api';
import { selectUser } from '../auth/auth.selectors';
import { ThreeDModel } from '../model-library/model-library';

const FurnitureLibrary = () => {
  const dispatch = useDispatch();
  const furniture = useSelector(selectFurniture);
  const user = useSelector(selectUser);
  const [furnitureList, setFurnitureList] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  useEffect(() => {
    fetchFurniture().then((data) => setFurnitureList(data));
  }, []);

  const handleAddFurniture = (furnitureItem) => {
    dispatch(addFurniture(furnitureItem));
  };

  const handleRemoveFurniture = (furnitureItem) => {
    dispatch(removeFurniture(furnitureItem));
  };

  const handleUpdateFurniture = (furnitureItem) => {
    dispatch(updateFurniture(furnitureItem));
  };

  const handleSelectFurniture = (furnitureItem) => {
    setSelectedFurniture(furnitureItem);
  };

  return (
    <div>
      <h1>Furniture Library</h1>
      <ul>
        {furnitureList.map((furnitureItem) => (
          <li key={furnitureItem.id}>
            <button onClick={() => handleSelectFurniture(furnitureItem)}>
              {furnitureItem.name}
            </button>
            <button onClick={() => handleAddFurniture(furnitureItem)}>Add</button>
            <button onClick={() => handleRemoveFurniture(furnitureItem)}>Remove</button>
            <button onClick={() => handleUpdateFurniture(furnitureItem)}>Update</button>
          </li>
        ))}
      </ul>
      {selectedFurniture && (
        <ThreeDModel
          model={selectedFurniture.model}
          textures={selectedFurniture.textures}
          materials={selectedFurniture.materials}
        />
      )}
    </div>
  );
};

export default FurnitureLibrary;