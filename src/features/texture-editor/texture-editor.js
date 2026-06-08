import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { uploadTexture, getTextures } from '../utils/model-utils';
import { setTexture } from '../features/model-editing/model-editing';
import { auth } from '../features/auth/auth';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const TextureEditor = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { model } = useSelector((state) => state.modelEditing);
  const [texture, setTextureState] = useState(null);
  const [textures, setTexturesState] = useState([]);
  const [material, setMaterialState] = useState(null);
  const [materials, setMaterialsState] = useState([]);

  useEffect(() => {
    const fetchTextures = async () => {
      const response = await axios.get('/api/textures');
      setTexturesState(response.data);
    };
    fetchTextures();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await axios.get('/api/materials');
      setMaterialsState(response.data);
    };
    fetchMaterials();
  }, []);

  const handleTextureChange = (event) => {
    setTextureState(event.target.files[0]);
  };

  const handleMaterialChange = (event) => {
    setMaterialState(event.target.value);
  };

  const handleUploadTexture = async () => {
    if (texture) {
      const response = await uploadTexture(texture);
      setTextureState(null);
      dispatch(setTexture(response.data));
    }
  };

  const handleApplyMaterial = async () => {
    if (material) {
      const response = await axios.post('/api/apply-material', {
        modelId: model.id,
        materialId: material,
      });
      dispatch(setTexture(response.data));
    }
  };

  return (
    <div>
      <h1>Texture Editor</h1>
      <input type="file" onChange={handleTextureChange} />
      <button onClick={handleUploadTexture}>Upload Texture</button>
      <select value={material} onChange={handleMaterialChange}>
        {materials.map((material) => (
          <option key={material.id} value={material.id}>
            {material.name}
          </option>
        ))}
      </select>
      <button onClick={handleApplyMaterial}>Apply Material</button>
      <div>
        {textures.map((texture) => (
          <img key={texture.id} src={texture.url} />
        ))}
      </div>
    </div>
  );
};

export default TextureEditor;