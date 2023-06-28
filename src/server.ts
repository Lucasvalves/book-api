import express, { Request, Response, NextFunction, Application } from 'express'
import {UserRoutes} from './routes/user.routes'
import { DbConnection } from './database'

const app:Application = express()
const userRoutes = new UserRoutes().getRoutes()
const database = new DbConnection
app.use(express.json()) //sempre que precisar passar algo para todas as rotas é no use
app.use('/user', userRoutes)
database.connect()
app.use(express.urlencoded({extended: true}))//para deixar a url mais legivel, sem espaços

app.use((err:Error, request: Request, response:Response, next:NextFunction)=>{
	if(err instanceof Error){
		return response.status(400).json({
			message: err.message
		})
	}
	return response.status(500).json({
		status: 500,
		message: 'Internal server error.'
	})
})

app.listen(3333, ()=>console.log('server is running'))
