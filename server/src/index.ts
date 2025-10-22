import express from 'express';
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import Content from './models/Content.js';
import Tags from './models/Tags.js';
import Link from './models/Link.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import ConnectDB from './utils/db.js';
import { signupSchema,loginSchema } from './validations/AuthSchema.js';
import { ZodError } from 'zod';
import { AuthMiddleware } from './middlewares/auth.js';

const app = express();
dotenv.config();
ConnectDB();

interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
    samesite: string;
}
app.use(express.json());
app.post('/api/v1/signup',async (req,res) => {
    const {username,email,password} = signupSchema.parse(req.body);
    
    if(!username || !email || !password) {
        return res.status(411).json({message: 'All feilds are required'});
    }
    try{
        let findUser = await User.findOne({email});
        if(findUser) {
            return res.status(400).json({message: 'User with this email already exists'});
        }
        let hashedPassword = await bcrypt.hash(password,10);
        findUser = new User({username,email,password: hashedPassword});
        await findUser.save();
        return res.status(201).json({message: 'User created successfully',username,email})
    } catch (err) {
    if (err instanceof ZodError) {
      return res.status(422).json({
        message: 'Invalid input',
        errors: err,
      });
    }

    return res.status(500).json({
      message: 'Internal Server Error',
      details: err instanceof Error ? err.message : err,
    });
  }
})

app.post('/api/v1/login',async (req,res) => {
    const {email,password} = loginSchema.parse(req.body);
    if(!email || !password) {
        return res.status(411).json({message: 'All Fields are required'});
    }
    try{
        let findUser = await User.findOne({email})
        if(!findUser) {
            return res.status(404).json({message:"User with this email doesn't exists"});
        }
        let comparePassword = await bcrypt.compare(password,findUser.password);
        if(!comparePassword) {
            return res.status(401).json({message: 'Invalid Credentials'});
        }
        console.log(process.env.JWT_SECRET);
        if(!process.env.JWT_SECRET || !process.env.NODE_ENV) {
            return res.status(500).json({message:"There's a missing env objects"})
        }
        let token = jwt.sign(
            {
                id:findUser._id,
                username:findUser.username
            },
            process.env.JWT_SECRET,
            {expiresIn:'1h'}
        )  
        const cookieOptions:CookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60*60*1000,
            samesite:process.env.NODE_ENV === 'production'?'strict':'lax'
        }
        res.cookie('token',token,cookieOptions);
        res.status(200).json({message:'Logged in successfully'});
    }catch (err) {
        if (err instanceof ZodError) {
        return res.status(422).json({
            message: 'Invalid input',
            errors: err,
        });
        }

        return res.status(500).json({
        message: 'Internal Server Error',
        details: err instanceof Error ? err.message : err,
        });
    }
})

app.post('/api/v1/card',AuthMiddleware,(req,res) => {
    const {link,title,type,tags} = req.body;
    try{
        let newCard = new Content({link,title,type,tags})
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.get('/api/v1/cards',(req,res) => {
    try{

    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.post('/api/v1/brain/share',(req,res) => {
    try{

    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.get('/api/v1/brain/:shareLink',(req,res) => {
    try{

    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.delete('/api/v1/content/:id',(req,res) => {
    try{

    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.post('/api/v1/logout',(req,res) => {
    try{

    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.listen(process.env.PORT,() => {
    console.log(`Listening on port: ${process.env.PORT}`);
})