import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'

export const register = async (req, res) => {      

        const { name, email, password } = req.body

        if(!name || !email || !password) {
            return res.status(400).json({success:false, message: "Please fill all the fields" })
        }

        try {
            const existingUser = await userModel.findOne({ email })

            if(existingUser) {
                return res.status(400).json({success:false, message: "User already exists" })
            }
            
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = await userModel.create({ name, email, password: hashedPassword })
 
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "100h" })
            res.cookie("token", token, 
                { httpOnly: true ,
                  secure: process.env.NODE_ENV === 'production',  
                }
            )

        } catch (error) {
            return res.status(500).json({success:false, message: error.message })
        }
    }