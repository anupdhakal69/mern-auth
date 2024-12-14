import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'

//?Register controller

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

            //Sending welcome email
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: "Welcome to Anup's website",
                text: `Hello ${name}, welcome to my website.`
            }

            await transporter.sendMail(mailOptions)

            return res.json({success:true, message: "User created successfully" })

        } catch (error) {
            return res.status(500).json({success:false, message: error.message })
        }
    }


//?Login controller   

export const login = async (req, res) => {

    const { email, password } = req.body

    if(!email || !password) {
        return res.status(400).json({success:false, message: "Please fill all the fields" })
    }

    try {
        
        const user = await userModel.findOne({ email })
    
        if(!user) {
            return res.status(400).json({success:false, message: "Invalid Credentials" })
        }
    
        const isMatch = await bcrypt.compare(password, user.password)
    
        if(!isMatch) {
            return res.status(400).json({success:false, message: "Invalid Credentials" })
        }
    
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "100h" })
        res.cookie("token", token,{ 
              httpOnly: true ,
              secure: process.env.NODE_ENV === 'production',  
            })
    
        return res.status(200).json({success:true, message: "Login Successful" })

    } catch (error) {
        return res.status(500).json({success:false, message: error.message })
    }
}

//?Logout controller

export const logout = async (req, res) => {

    try {
        res.clearCookie("token",{
            httpOnly: true ,
            secure: process.env.NODE_ENV === 'production',  
        })
        
    } catch (error) {
        return res.status(500).json({success:false, message: error.message })
    }
}

//?Get user controller

export const getUser = async (req, res) => {
    
        try {
            const users = await userModel.find({name})
            return res.status(200).json({success:true, users })
    
        } catch (error) {
            return res.status(500).json({success:false, message: error.message })
        }
}