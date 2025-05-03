import { User } from "../models/User.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetPasswordEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";


export const signup = async (req,res)=>{
    const {email,password,name} = req.body;
    try {
        if(!email || !password|| !name){
            throw new Error("Please provide all the fields")
        }

        const ExistedUser = await User.findOne({email});
        if(ExistedUser){
            return res.status(400).json({success:false,message:`user already exists`})
        }
        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            email,
            password:hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, 

        })

        await user.save();
        console.log("Created User :", user);
        
        generateTokenAndSetCookie(res,user._id)

        await sendVerificationEmail(user.email,verificationToken)

        return res.status(201).json({success:true,message:"User created successfully",user:{
            ...user._doc,password:undefined
        }})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

export const login = async (req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email})
        if(!user){
            throw new Error("Invalid credentials")
        }

        const isPasswordCorrect = await bcryptjs.compare(password,user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }

        generateTokenAndSetCookie(res,user._id)
        user.lastLogin = Date.now()
        await user.save()

        return res.status(200).json({success:true,message:"Logged in successfully",user:{
            ...user._doc,password:undefined
        }})
        
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
        
    }
}

export const logout = async (req,res)=>{
    res.clearCookie("token")
    res.status(200).json({success:true,message:"Logged out successfully"})
}

export const verifyEmail = async(req,res)=>{
    const {code}= req.body

    try {
        const user = await User.findOne({verificationToken:code,
            verificationTokenExpiresAt:{$gt:Date.now()}
        })
        console.log(`TOKEN VERIFIED: ${user}`);
        

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired verification code"})
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save()

        await sendWelcomeEmail(user.email,user.username)
        return res.status(200).json({success:true,message:"Welcome email sent successfully"})

    } catch (error) {
        console.log("Error in verify email",error.message);
        throw new Error("Error in verify email",error.message)
        
    }
}

export const forgotPassword = async(req,res)=>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success:false,message:"User not found"})
        }

        const resetToken = crypto.randomBytes(20).toString("hex") 
        const resetTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000
        user.resetPasswordToken = resetToken
        user.resetPasswodExpiresAt = resetTokenExpiresAt
        await user.save()

        await sendResetPasswordEmail(user.email,`${process.env.FRONTEND_URL}/reset-token/${resetToken}`)
        return res.status(200).json({success:true,message:"Reset password email sent successfully"})
        
    } catch (error) {
        console.log("Error in forgot password",error.message);
        return res.status(400).json({success:false,message:error.message})
        
    }
}

export const resetPassword = async(req,res)=>{
    try {
        const {token}=req.params
        const {password} = req.body
        const user = await User.findOne({resetPasswordToken:token,resetPasswodExpiresAt:{$gt:Date.now()}})
        console.log(`TOKEN VERIFIED: ${user}`);

        if(!user){
            return res.status(400).json({success:false,message:"Invalid or expired reset token"})
        }
        const hashedPassword = await bcryptjs.hash(password,10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswodExpiresAt = undefined
        await user.save()

        await sendResetSuccessEmail(user.email)

        return res.status(200).json({success:true,message:"Password reset successfully"})
        
    } catch (error) {
        console.log("Error in reset password",error.message);
        return res.status(400).json({success:false,message:error.message})
        
    }
}

export const checkAuth = async(req,res)=>{
    try {
        const user = await User.findById(req.userId).select("-password")
    if(!user){
        return res.status(401).json({success:false,message:"Not authenticated"})
    }
    return res.status(200).json({success:true,
        message:"User authenticated successfully",
        user
    })
    } catch (error) {
        console.log("Error in check auth",error.message);
        return res.status(401).json({success:false,message:error.message})
        
    }
}