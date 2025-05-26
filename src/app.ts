import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/middleware/globalErrorHandler'
const app: Application = express()
import cors from 'cors'
import { routes } from './app/routes'
import notFound from './app/middleware/notFound'




//parser
app.use(express.json())
app.use(cors())

app.get('/', (req:Request, res:Response) => {
  res.send('Hello from cu backend server!!!')
})

app.use('/api/v1', routes)


//gloabal error handler
app.use(globalErrorHandler)


app.use(notFound)


export default app;
