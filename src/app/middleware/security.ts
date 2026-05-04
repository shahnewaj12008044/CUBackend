import { Application } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';

export const applySecurityMiddleware = (app: Application) => {
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(hpp({
    whitelist: ['tag'],
  }));

  app.use(mongoSanitize());
};