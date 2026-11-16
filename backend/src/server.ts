import app from './app';
import { config } from './config';
import { prisma } from './config/prisma';

const PORT = config.port;

async function bootstrap() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✔ Connected to PostgreSQL database');

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🎨 ARTÉRA API Server running on port ${PORT}`);
      console.log(`  🔗 Environment: ${config.nodeEnv}`);
      console.log(`  🌐 Frontend: ${config.frontendUrl}`);
      console.log(`  🖼  Storage: ${config.cloudinary.isConfigured ? 'Cloudinary' : 'Local Disk (/uploads)'}`);
      console.log(`======================================================\n`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Database disconnected. Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

