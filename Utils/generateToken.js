import jwt from 'jsonwebtoken'
import User from '../Models/user.js'

export const generateToken = (User) => jwt.sign({ id: User.id }, process.env.SECRET_KEY, { expiresIn: "4m" })

