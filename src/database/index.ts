import mongoose from 'mongoose'

class DbConnection{
	async connect(){
		try {
			await mongoose.connect(
				'mongodb+srv://adm:LlOG4C76BLEzgzej@cluster0.oyrvmhb.mongodb.net/bookapi'
			)
			console.log('connect to database')

		} catch (error) {
			console.log('Erro to connect database')
		}
	}
}

export {DbConnection}
