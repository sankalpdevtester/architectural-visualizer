import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { modelLibrary } from '../model-library/model-library';
import { auth } from '../auth/auth';
import { modelUpload } from '../model-upload/model-upload';
import { config } from '../../config/index';
import { models } from '../../models/index';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ModelEditing = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userId } = useSelector((state) => state.auth);
  const { currentModel } = useSelector((state) => state.modelLibrary);
  const [scene, setScene] = useState(new THREE.Scene());
  const [camera, setCamera] = useState(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const [renderer, setRenderer] = useState(new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true
  }));
  const [controls, setControls] = useState(new OrbitControls(camera, renderer.domElement));
  const [model, setModel] = useState(currentModel);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    if (!model) return;
    const geometry = new THREE.BufferGeometry().from(model.geometry);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
  }, [model]);

  const handleEditModel = (newModel) => {
    setModel(newModel);
    setUndoStack([...undoStack, model]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    setRedoStack([...redoStack, model]);
    setModel(undoStack[undoStack.length - 1]);
    setUndoStack(undoStack.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    setUndoStack([...undoStack, model]);
    setModel(redoStack[redoStack.length - 1]);
    setRedoStack(redoStack.slice(0, -1));
  };

  const handleSaveModel = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/models/${model.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(model)
      });
      const data = await response.json();
      dispatch(modelLibrary.actions.updateModel(data));
      router.push('/models');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <canvas id="canvas" />
      <button onClick={handleUndo}>Undo</button>
      <button onClick={handleRedo}>Redo</button>
      <button onClick={handleSaveModel}>Save</button>
    </div>
  );
};

export default ModelEditing;