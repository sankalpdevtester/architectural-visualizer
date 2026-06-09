import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateModel } from '../model-editing/model-editing';
import { getModel } from '../model-library/model-library';
import { addLighting } from '../model-upload/model-upload';
import { saveModel } from '../models/index';
import { auth } from '../features/auth/auth';
import { TextureEditor } from '../features/texture-editor/texture-editor';
import { modelUtils } from '../utils/model-utils';

const LightingControls = () => {
  const dispatch = useDispatch();
  const model = useSelector((state) => state.model);
  const user = useSelector((state) => state.user);
  const [lighting, setLighting] = useState({
    ambient: 0.5,
    diffuse: 0.5,
    specular: 0.5,
    shininess: 10,
  });
  const [atmosphere, setAtmosphere] = useState({
    fog: false,
    fogColor: '#ffffff',
    fogNear: 1,
    fogFar: 100,
  });

  useEffect(() => {
    if (model) {
      setLighting(model.lighting);
      setAtmosphere(model.atmosphere);
    }
  }, [model]);

  const handleLightingChange = (e) => {
    const { name, value } = e.target;
    setLighting((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleAtmosphereChange = (e) => {
    const { name, value } = e.target;
    setAtmosphere((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedModel = { ...model, lighting, atmosphere };
    dispatch(updateModel(updatedModel));
    dispatch(saveModel(updatedModel));
  };

  const handleAddLighting = () => {
    dispatch(addLighting(lighting));
  };

  return (
    <div>
      <h2>Lighting Controls</h2>
      <form>
        <label>
          Ambient:
          <input
            type="range"
            name="ambient"
            min="0"
            max="1"
            step="0.1"
            value={lighting.ambient}
            onChange={handleLightingChange}
          />
          {lighting.ambient}
        </label>
        <label>
          Diffuse:
          <input
            type="range"
            name="diffuse"
            min="0"
            max="1"
            step="0.1"
            value={lighting.diffuse}
            onChange={handleLightingChange}
          />
          {lighting.diffuse}
        </label>
        <label>
          Specular:
          <input
            type="range"
            name="specular"
            min="0"
            max="1"
            step="0.1"
            value={lighting.specular}
            onChange={handleLightingChange}
          />
          {lighting.specular}
        </label>
        <label>
          Shininess:
          <input
            type="range"
            name="shininess"
            min="1"
            max="100"
            step="1"
            value={lighting.shininess}
            onChange={handleLightingChange}
          />
          {lighting.shininess}
        </label>
      </form>
      <h2>Atmosphere Controls</h2>
      <form>
        <label>
          Fog:
          <input
            type="checkbox"
            name="fog"
            checked={atmosphere.fog}
            onChange={handleAtmosphereChange}
          />
        </label>
        <label>
          Fog Color:
          <input
            type="color"
            name="fogColor"
            value={atmosphere.fogColor}
            onChange={handleAtmosphereChange}
          />
        </label>
        <label>
          Fog Near:
          <input
            type="range"
            name="fogNear"
            min="1"
            max="100"
            step="1"
            value={atmosphere.fogNear}
            onChange={handleAtmosphereChange}
          />
          {atmosphere.fogNear}
        </label>
        <label>
          Fog Far:
          <input
            type="range"
            name="fogFar"
            min="1"
            max="100"
            step="1"
            value={atmosphere.fogFar}
            onChange={handleAtmosphereChange}
          />
          {atmosphere.fogFar}
        </label>
      </form>
      <button onClick={handleSave}>Save</button>
      <button onClick={handleAddLighting}>Add Lighting</button>
      <TextureEditor />
    </div>
  );
};

export default LightingControls;