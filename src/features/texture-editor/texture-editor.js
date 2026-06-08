import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { modelUtils } from '../utils/model-utils';
import { textureEditorActions } from '../features/texture-editor/texture-editor.slice';
import { modelUploadActions } from '../features/model-upload/model-upload.slice';
import { authActions } from '../features/auth/auth.slice';
import axios from 'axios';
import { MongoClient } from 'mongodb';

const TextureEditor = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId, modelName } = router.query;
  const { textures, materials } = useSelector((state) => state.textureEditor);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [textureName, setTextureName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [textureImage, setTextureImage] = useState(null);
  const [materialImage, setMaterialImage] = useState(null);

  useEffect(() => {
    dispatch(textureEditorActions.getTextures());
    dispatch(textureEditorActions.getMaterials());
  }, [dispatch]);

  const handleTextureChange = (event) => {
    setSelectedTexture(event.target.value);
  };

  const handleMaterialChange = (event) => {
    setSelectedMaterial(event.target.value);
  };

  const handleTextureNameChange = (event) => {
    setTextureName(event.target.value);
  };

  const handleMaterialNameChange = (event) => {
    setMaterialName(event.target.value);
  };

  const handleTextureImageChange = (event) => {
    setTextureImage(event.target.files[0]);
  };

  const handleMaterialImageChange = (event) => {
    setMaterialImage(event.target.files[0]);
  };

  const handleSaveTexture = async () => {
    const formData = new FormData();
    formData.append('textureName', textureName);
    formData.append('textureImage', textureImage);

    try {
      const response = await axios.post('/api/textures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(textureEditorActions.addTexture(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveMaterial = async () => {
    const formData = new FormData();
    formData.append('materialName', materialName);
    formData.append('materialImage', materialImage);

    try {
      const response = await axios.post('/api/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      dispatch(textureEditorActions.addMaterial(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const handleApplyTexture = async () => {
    if (selectedTexture) {
      try {
        const response = await axios.put(`/api/models/${modelName}/textures`, {
          textureId: selectedTexture,
        });

        dispatch(modelUploadActions.updateModel(response.data));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleApplyMaterial = async () => {
    if (selectedMaterial) {
      try {
        const response = await axios.put(`/api/models/${modelName}/materials`, {
          materialId: selectedMaterial,
        });

        dispatch(modelUploadActions.updateModel(response.data));
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Texture and Material Editor</h1>
      <div>
        <label>Texture:</label>
        <select value={selectedTexture} onChange={handleTextureChange}>
          {textures.map((texture) => (
            <option key={texture._id} value={texture._id}>
              {texture.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Material:</label>
        <select value={selectedMaterial} onChange={handleMaterialChange}>
          {materials.map((material) => (
            <option key={material._id} value={material._id}>
              {material.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Texture Name:</label>
        <input type="text" value={textureName} onChange={handleTextureNameChange} />
      </div>
      <div>
        <label>Texture Image:</label>
        <input type="file" onChange={handleTextureImageChange} />
      </div>
      <div>
        <label>Material Name:</label>
        <input type="text" value={materialName} onChange={handleMaterialNameChange} />
      </div>
      <div>
        <label>Material Image:</label>
        <input type="file" onChange={handleMaterialImageChange} />
      </div>
      <button onClick={handleSaveTexture}>Save Texture</button>
      <button onClick={handleSaveMaterial}>Save Material</button>
      <button onClick={handleApplyTexture}>Apply Texture</button>
      <button onClick={handleApplyMaterial}>Apply Material</button>
    </div>
  );
};

export default TextureEditor;