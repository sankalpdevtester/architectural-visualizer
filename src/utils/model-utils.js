/**
 * Utility functions for 3D model processing and optimization.
 *
 * @module src/utils/model-utils
 */

import { Model } from 'src/models/index';
import { modelLibrary } from 'src/features/model-library/model-library';
import { furnitureLibrary } from 'src/features/furniture-library/furniture-library';

/**
 * Optimize a 3D model by reducing its polygon count and removing unnecessary data.
 *
 * @param {Model} model - The 3D model to optimize.
 * @returns {Model} The optimized 3D model.
 */
export function optimizeModel(model) {
  // Remove unnecessary data from the model
  delete model.metadata;
  delete model.history;

  // Reduce the polygon count of the model
  model.geometry = simplifyGeometry(model.geometry);

  return model;
}

/**
 * Simplify the geometry of a 3D model by reducing its polygon count.
 *
 * @param {Object} geometry - The geometry of the 3D model.
 * @returns {Object} The simplified geometry.
 */
function simplifyGeometry(geometry) {
  // Use a library like Three.js to simplify the geometry
  const simplifiedGeometry = geometry.clone();
  simplifiedGeometry.mergeVertices();
  simplifiedGeometry.computeVertexNormals();

  return simplifiedGeometry;
}

/**
 * Add furniture to a 3D model.
 *
 * @param {Model} model - The 3D model to add furniture to.
 * @param {string} furnitureId - The ID of the furniture to add.
 * @returns {Model} The 3D model with the added furniture.
 */
export function addFurniture(model, furnitureId) {
  // Get the furniture from the furniture library
  const furniture = furnitureLibrary.getFurniture(furnitureId);

  // Add the furniture to the model
  model.furniture.push(furniture);

  return model;
}

/**
 * Remove furniture from a 3D model.
 *
 * @param {Model} model - The 3D model to remove furniture from.
 * @param {string} furnitureId - The ID of the furniture to remove.
 * @returns {Model} The 3D model with the removed furniture.
 */
export function removeFurniture(model, furnitureId) {
  // Find the index of the furniture in the model
  const furnitureIndex = model.furniture.findIndex((furniture) => furniture.id === furnitureId);

  // Remove the furniture from the model
  if (furnitureIndex !== -1) {
    model.furniture.splice(furnitureIndex, 1);
  }

  return model;
}

/**
 * Get the bounding box of a 3D model.
 *
 * @param {Model} model - The 3D model to get the bounding box for.
 * @returns {Object} The bounding box of the 3D model.
 */
export function getBoundingBox(model) {
  // Use a library like Three.js to get the bounding box
  const boundingBox = new THREE.Box3().setFromObject(model);

  return boundingBox;
}

/**
 * Export a 3D model as a GLTF file.
 *
 * @param {Model} model - The 3D model to export.
 * @returns {Promise<string>} The exported GLTF file as a string.
 */
export async function exportModelAsGltf(model) {
  // Use a library like Three.js to export the model as a GLTF file
  const gltfExporter = new THREE.GLTFExporter();
  const gltf = await gltfExporter.parse(model);

  return gltf;
}