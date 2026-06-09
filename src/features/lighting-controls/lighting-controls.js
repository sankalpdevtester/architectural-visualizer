import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateModel } from '../model-editing/model-editing';
import { getModel } from '../model-library/model-library';
import { addLighting } from '../model-upload/model-upload';
import { getTextures } from '../texture-editor/texture-editor';
import { getFurniture } from '../furniture-library/furniture-library';
import { auth } from '../auth/auth';
import { modelUtils } from '../utils/model-utils';
import { config } from '../config/index';
import axios from 'axios';

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
    fogFar: 1000,
  });

  useEffect(() => {
    if (model) {
      setLighting(model.lighting);
      setAtmosphere(model.atmosphere);
    }
  }, [model]);

  const handleLightingChange = (e) => {
    const { name, value } = e.target;
    setLighting((prevLighting) => ({ ...prevLighting, [name]: value }));
  };

  const handleAtmosphereChange = (e) => {
    const { name, value } = e.target;
    setAtmosphere((prevAtmosphere) => ({ ...prevAtmosphere, [name]: value }));
  };

  const handleSave = async () => {
    const updatedModel = {
      ...model,
      lighting,
      atmosphere,
    };
    dispatch(updateModel(updatedModel));
    try {
      const response = await axios.put(`${config.apiUrl}/models/${model._id}`, updatedModel, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Lighting and Atmosphere Controls</h2>
      <form>
        <label>
          Ambient:
          <input
            type="range"
            name="ambient"
            min="0"
            max="1"
            step="0.01"
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
            step="0.01"
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
            step="0.01"
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
            max="1000"
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
            max="1000"
            step="1"
            value={atmosphere.fogFar}
            onChange={handleAtmosphereChange}
          />
          {atmosphere.fogFar}
        </label>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default LightingControls;