import { App } from './app';
import { Database } from './config/database.config';
import { config } from './config/env.config';
import logger from './shared/utils/logger.util';

class Server {
  private app: App;
  private database: Database;

  constructor() {
    this.app = new App();
    this.database = Database.getInstance();
  }

  public async start(): Promise<void> {
    try {
      await this.database.connect();
      this.app.listen(config.port);
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    await this.database.disconnect();
    logger.info('Server stopped');
  }
}

const server = new Server();
server.start();

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received');
  await server.stop();
  process.exit(0);
});
