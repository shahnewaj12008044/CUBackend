/* eslint-disable no-console */
import { Server } from 'http';
import mongoose from 'mongoose';

import app from './app';
import config from './app/config';
import connectDB from './lib/mongodb';

let server: Server;

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  if (process.env.NODE_ENV !== 'production') process.exit(1);
});

async function shutdown(signal: string, error?: unknown) {
  try {
    if (error) {
      console.error(`${signal}:`, error);
    } else {
      console.log(`${signal} received. Shutting down gracefully...`);
    }

    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log('HTTP server closed.');
    }

    await mongoose.connection.close();
    console.log('MongoDB connection closed.');

    process.exit(error ? 1 : 0);
  } catch (shutdownError) {
    console.error('Error during shutdown:', shutdownError);
    process.exit(1);
  }
}

async function main() {
  try {
    await connectDB();
    console.log('Database connected successfully.');

    server = app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  if (process.env.NODE_ENV !== 'production') shutdown('Unhandled Rejection', reason);
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  shutdown('SIGINT');
});