import morgan from 'morgan';


export const requestLogger =
  process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev');