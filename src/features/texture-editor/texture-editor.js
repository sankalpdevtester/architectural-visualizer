import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { modelUtils } from '../utils/model-utils';
import { auth } from '../features/auth/auth';
import { modelEditing } from '../features/model-editing/model-editing';
import { textureEditorActions } from '../features/texture-editor/texture-editor.slice';
import { textureEditorApi } from '../api/texture-editor.api';
import { textureEditorConstants } from '../constants/texture-editor.constants';
import { modelConstants } from '../constants/model.constants';
import { textureEditorStyles } from '../styles/texture-editor.styles';

const TextureEditor = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId, token } = useSelector((state) => state.auth);
  const { currentModel } = useSelector((state) => state.modelEditing);
  const [texture, setTexture] = useState(null);
  const [material, setMaterial] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (currentModel) {
      const textureId = currentModel.textureId;
      if (textureId) {
        textureEditorApi.getTexture(textureId, token)
          .then((response) => {
            setTexture(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [currentModel, token]);

  const handleTextureChange = (event) => {
    const newTexture = event.target.files[0];
    setTexture(newTexture);
    dispatch(textureEditorActions.setTexture(newTexture));
  };

  const handleMaterialChange = (event) => {
    const newMaterial = event.target.value;
    setMaterial(newMaterial);
    dispatch(textureEditorActions.setMaterial(newMaterial));
  };

  const handlePreview = () => {
    if (texture && material) {
      const previewUrl = modelUtils.generatePreviewUrl(texture, material);
      setPreview(previewUrl);
    }
  };

  const handleSave = () => {
    if (texture && material) {
      const textureData = {
        name: texture.name,
        url: texture.url,
        material: material,
      };
      textureEditorApi.saveTexture(textureData, token)
        .then((response) => {
          dispatch(textureEditorActions.saveTexture(response.data));
          router.push(`/models/${currentModel.id}`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className={textureEditorStyles.container}>
      <h1>Texture and Material Editor</h1>
      <input
        type="file"
        onChange={handleTextureChange}
        accept={textureEditorConstants.TEXTURE_MIME_TYPES}
      />
      <select value={material} onChange={handleMaterialChange}>
        {modelConstants.MATERIALS.map((material) => (
          <option key={material} value={material}>
            {material}
          </option>
        ))}
      </select>
      <button onClick={handlePreview}>Preview</button>
      {preview && (
        <img src={preview} alt="Texture Preview" />
      )}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default TextureEditor;