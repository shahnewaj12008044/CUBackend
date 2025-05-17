import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/middleware/globalErrorHandler'
const app: Application = express()
import cors from 'cors'
//parser
app.use(express.json())
app.use(cors())

app.get('/', (req:Request, res:Response) => {
  res.send('Hello from cu backend server!!!')
})


//gloabal error handler
app.use(globalErrorHandler)


export default app;
