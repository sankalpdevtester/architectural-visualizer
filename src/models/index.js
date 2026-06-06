import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import config from '../config/index';

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define user model
const userSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const User = mongoose.model('User', userSchema);

// Define model model
const modelSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: String, required: true, ref: 'User' },
  file: { type: String, required: true },
});

const Model = mongoose.model('Model', modelSchema);

// Define project model
const projectSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: { type: String },
  userId: { type: String, required: true, ref: 'User' },
  models: [{ type: String, ref: 'Model' }],
});

const Project = mongoose.model('Project', projectSchema);

// Export models
export { User, Model, Project };

// Example usage
async function main() {
  try {
    // Create a new user
    const user = new User({ name: 'John Doe', email: 'john@example.com', password: 'password123' });
    await user.save();

    // Create a new model
    const model = new Model({ name: 'Example Model', description: 'This is an example model', userId: user.id, file: 'example.model' });
    await model.save();

    // Create a new project
    const project = new Project({ name: 'Example Project', description: 'This is an example project', userId: user.id, models: [model.id] });
    await project.save();

    console.log('User created:', user);
    console.log('Model created:', model);
    console.log('Project created:', project);
  } catch (error) {
    console.error(error);
  }
}

main();