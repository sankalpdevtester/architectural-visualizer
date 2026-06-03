// Import required modules
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

// Define the configuration interface
interface Config {
  port: number;
  mongoUri: string;
  nodeEnv: string;
  expressSessionSecret: string;
  nextJsPort: number;
  reduxDevTools: boolean;
}

// Define the configuration class
class Configuration {
  private config: Config;

  constructor() {
    this.config = {
      port: parseInt(process.env.PORT, 10) || 3000,
      mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
      nodeEnv: process.env.NODE_ENV || 'development',
      expressSessionSecret: process.env.EXPRESS_SESSION_SECRET || 'secret',
      nextJsPort: parseInt(process.env.NEXT_JS_PORT, 10) || 3001,
      reduxDevTools: process.env.REDUX_DEV_TOOLS === 'true' || false,
    };
  }

  // Get the configuration
  public getConfig(): Config {
    return this.config;
  }

  // Get the port
  public getPort(): number {
    return this.config.port;
  }

  // Get the MongoDB URI
  public getMongoUri(): string {
    return this.config.mongoUri;
  }

  // Get the Node.js environment
  public getNodeEnv(): string {
    return this.config.nodeEnv;
  }

  // Get the Express.js session secret
  public getExpressSessionSecret(): string {
    return this.config.expressSessionSecret;
  }

  // Get the Next.js port
  public getNextJsPort(): number {
    return this.config.nextJsPort;
  }

  // Get the Redux DevTools flag
  public getReduxDevTools(): boolean {
    return this.config.reduxDevTools;
  }
}

// Export the configuration instance
const config = new Configuration();

export default config;