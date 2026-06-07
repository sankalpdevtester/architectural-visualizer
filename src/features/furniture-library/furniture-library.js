import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import axios from 'axios';
import { modelActions } from '../model-library/model-library';
import { authActions } from '../auth/auth';
import { modelUploadActions } from '../model-upload/model-upload';
import { modelEditingActions } from '../model-editing/model-editing';
import { config } from '../../config/index';

const FurnitureLibrary = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [furniture, setFurniture] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/furniture`);
        setFurniture(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFurniture();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event) => {
    setFilterTerm(event.target.value);
  };

  const handleAddFurniture = (furnitureItem) => {
    dispatch(modelEditingActions.addFurniture(furnitureItem));
    router.push('/model-editing');
  };

  const filteredFurniture = furniture.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      item.category.toLowerCase().includes(filterTerm.toLowerCase())
    );
  });

  return (
    <div>
      <h1>Furniture Library</h1>
      <input
        type="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search furniture"
      />
      <select value={filterTerm} onChange={handleFilter}>
        <option value="">All categories</option>
        <option value="chair">Chair</option>
        <option value="table">Table</option>
        <option value="sofa">Sofa</option>
      </select>
      <ul>
        {filteredFurniture.map((item) => (
          <li key={item._id}>
            <h2>{item.name}</h2>
            <p>Category: {item.category}</p>
            <button onClick={() => handleAddFurniture(item)}>Add to model</button>
            <div>
              <img src={item.previewImage} alt={item.name} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FurnitureLibrary;