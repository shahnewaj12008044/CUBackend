import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import morgan from 'morgan';

import { routes } from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import { authLimiter, limiter } from './app/utils/rateLimiter';
import { applySecurityMiddleware } from './app/middleware/security';

const app: Application = express();

// trust proxy should be set before rate limiter / IP-based middleware
app.set('trust proxy', 1);
app.disable('x-powered-by');

// logging early so all requests are visible
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

//! security middleware
// app.use(helmet({
//   contentSecurityPolicy: false // or custom config
// }));
// app.use(hpp({
//   whitelist: ['tag']
// }));
// app.use(mongoSanitize());
applySecurityMiddleware(app);

// parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// cors
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || ['http://localhost:3000'],
    credentials: true,
  })
);

// health/root routes
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Hello from cu backend server!!!');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// rate limiting
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1', limiter, routes);

// 404 + error handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;