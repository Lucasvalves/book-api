import { Request, Response, NextFunction  } from 'express'
import { User } from '../models'
import { compare, hash } from 'bcrypt'
import { UserRepository } from '../repositories/UserRepository'

class UserController{
	private userRepository: UserRepository
	constructor(){
		this.userRepository =  new UserRepository()
	}
	async index(request:Request, response:Response, next:NextFunction){
		//buscar todos
		const {page, size} = request.query //para pegar todos por params
		const DEFAULT_PAGE = 1
		const DEFAULT_SIZE = 10

		const pageNumber = page ? parseInt(page as string, 10) : DEFAULT_PAGE
		const pageSizeNumber = size ? parseInt(size as string, 10) : DEFAULT_SIZE

		try {
			const result =  await this.userRepository.findAll({
				page: pageNumber,
				size: pageSizeNumber
			})//para pegar todos por params
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
	async show(request:Request, response:Response, next:NextFunction){
		//buscar apenas um
		const {id} = request.params

		try {
			const result = await this.userRepository.findById(id)
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
	async store(request:Request, response:Response, next:NextFunction){
		//criar
		const {name, password, email} = request.body
		try {
			const findUser = await this.userRepository.findByEmail(email)
			if(findUser){
				throw new Error('User already exists')
			}
			const hasPassword = await hash(password, 10)

			const createUser = await this.userRepository.create({name, password:hasPassword, email})
			return response.json(createUser)

		} catch (error) {
			next(error)
		}
	}
	async update(request:Request, response:Response, next:NextFunction){
		//atualizar
		const {id} = request.params
		const {name, password, oldPassword} = request.body
		try {
			const findUser = await this.userRepository.findById(id)
			if(!findUser){
				throw new Error('User not found')
			}

			if(password && oldPassword && findUser.password){
				const passwordMatch = await compare(oldPassword, findUser.password)
				if(!passwordMatch){
					throw new Error('Password doesn`t match')
				}
				const hasPassword = await hash(password, 10)

				await this.userRepository.updatePassword(hasPassword, id)
			}
			if(name){
				await this.userRepository.updateName(name, id)
			}
			return response.json({message: 'Update successflly'})
		} catch (error) {
			next(error)
		}
	}
	async delete(request:Request, response:Response, next:NextFunction){
		const {id} = request.params
		try {
			const findUser = await this.userRepository.findById(id)
			if (!findUser){
				throw new Error('User not found.')
			}
			const result = await this.userRepository.delete(id)
			return response.json(result)
		} catch (error) {
			next(error)
		}
	}
}

export {UserController}
