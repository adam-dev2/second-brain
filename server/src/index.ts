import express from 'express';
import jwt from 'jsonwebtoken'
import User from './models/User.js'
import Content from './models/Content.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import ConnectDB from './utils/db.js';
import { signupSchema,loginSchema } from './validations/AuthSchema.js';
import { ZodError } from 'zod';
import { AuthMiddleware } from './middlewares/auth.js';
import { nanoid } from 'nanoid';
import { ConnectQdrant } from './config/QdrantConfig.js';
import { getEmbedding } from './config/embeddings.js';
import { COLLECTION_NAME, qdrantClient } from './utils/qDrant.js';
import {v4 as uuidv4} from 'uuid'
import cors from 'cors'

const app = express();
dotenv.config();
ConnectDB();
ConnectQdrant();

interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
    sameSite: 'strict'|'lax'|'none';
}
app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.post('/api/v1/signup',async (req,res) => {
    const validation = signupSchema.safeParse(req.body);
    if(!validation) {
        return res.status(400)
    }
    const username = validation.data?.username;
    const email = validation.data?.email;
    const password = validation.data?.password;
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
    const validation = loginSchema.safeParse(req.body);
    if(!validation) {
        return res.status(400)
    }
    const email = validation.data?.email;
    const password = validation.data?.password;
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
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60*60*1000,
            sameSite:process.env.NODE_ENV === 'production'?'none':'lax'
        }
        res.cookie('token',token,cookieOptions);
        res.status(200).json({message:'Logged in successfully',token});
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

app.post('/api/v1/card',AuthMiddleware,async(req,res) => {
    const {link,title,type,share} = req.body;
    const tags = req.body.tags;
    if(!tags || !link || !title || !type) {
        return res.status(400).json({message:"All fields are important"});
    }
    try{
        const userID = req.user?.id;
        if(!userID) {
            return res.status(401).json({message:"Unauthorized"});
        }
        const qdrantID = uuidv4();
        const embeddings = await getEmbedding(title);

        await qdrantClient.upsert(COLLECTION_NAME,{
            wait: true,
            points:[
                {
                    id:qdrantID,
                    vector:embeddings,
                    payload:{
                        userId: userID,
                        title:title,
                        link:title,
                        type:type,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                },
            ],
        });
        
        const newCard = new Content({
            userId:userID,
            cardId:qdrantID,
            link,
            title,
            type,
            tags,
            share,
            createdAt:new Date().toISOString(),
            updatedAt:new Date().toISOString()
        })
        await newCard.save();
        console.log(`Storing Card title: ${newCard.title}`);
        console.log(`Card Stored successfully with ID: ${newCard.id}`);
        
        return res.status(201).json({message:'Card created successfully',card:newCard});
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.put('/api/v1/editCard/:id',AuthMiddleware,async(req,res) => {
    try{
        const {id} = req.params;
        const {link,title,share,tags} = req.body;
        const findCard = await Content.findById(id)
        if(!findCard) {
            return res.status(404).json({message: 'Card with that id not found'});
        }
        if(findCard.title != title){
            const cardId: any = findCard.cardId;
            const newTitleEmbeddings = await getEmbedding(title);
            const updateExisting = await qdrantClient.retrieve(COLLECTION_NAME,{
                ids:[cardId],
                with_payload:true
            })

            if(updateExisting.length === 0) {
                return res.status(404).json({message: 'Card not found'});
            }

            const updatePayload = updateExisting[0]?.payload;
            await qdrantClient.upsert(COLLECTION_NAME,{
                wait:true,
                points:[
                    {
                        id:cardId,
                        vector: newTitleEmbeddings,
                        payload: {
                            ...updatePayload,
                            title,
                            link,
                            tags,
                            updatedAt: new Date().toISOString()
                        }
                    }
                ]
            });

            console.log(`Card updated Successfully ${cardId}`);
        }
        const updateCard = await Content.findByIdAndUpdate(id,{
            link,
            title,
            share,
            tags,
            updatedAt:Date.now()
        })

        return res.status(200).json({message:"Updated card successfully",updateCard});
    }catch(err) {
        return res.status(500).json({message:'Internal Server Error'});
    }
})

app.post('/api/v1/query',AuthMiddleware,async(req,res) => {
    const {query} = req.body
    if(!query) {
        return res.status(400).json({message: "query shouldn't be empty"})
    }
    try {
        const queryEmbeddings = await getEmbedding(query);
        const searchResutls = await qdrantClient.search(COLLECTION_NAME,{
            vector: queryEmbeddings,
            limit:3
        });

        console.log(`Nearest Cards: ${searchResutls}`);
        searchResutls.forEach((res) =>{
            console.log({
                id:res.id,
                score:res.score,
                payload:res.payload
            });
            
        })
        return res.status(200).json({searchResutls})
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.get('/api/v1/cards',AuthMiddleware,async(req,res) => {
    try{
        const userID = req.user?.id;
        console.log(userID);
        
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const FetchContent = await Content.find({userId:userID});
        if(!FetchContent) {
            return res.status(404).json({message:"no cards to show"});
        }
        return res.status(200).json({message:"Fetched cards successfully",cards:FetchContent});
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.get('/api/v1/brain/share',AuthMiddleware,async(req,res) => {
    try{
        const userID = req.user?.id;
        if(!userID) {
            return res.status(401).json({message:'Unauthorized'});
        }
        if(!process.env.JWT_SECRET) {
            return res.status(500).json({message:'jwt secret not found'});
        }
        const shareHash = nanoid();
        const updateUser = await User.findByIdAndUpdate(userID,{
            sharelink:`${shareHash}`
        })
        console.log(updateUser);
        
        return res.status(200).json({message:'Sharelink Generated Successfully',ShareableLink:`/api/v1/brain/${shareHash}`})
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.get('/api/v1/brain/:shareLink',async(req,res) => {
    try{
        const {shareLink} = req.params;
        if(!shareLink) {
            return res.status(400).json({message:"sharelink is required"});
        }
        const findUser = await User.findOne({sharelink:shareLink})
        if(!findUser) {
            return res.status(404).json({message:"Can't find user"});
        }
        const findCards = await Content.find({userId:findUser.id,share:true})
        return res.status(200).json({ShareableCards: findCards});
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.delete('/api/v1/content/:id',AuthMiddleware,async(req,res) => {
    const {id} = req.params;
    try{
        const findCard = await Content.findByIdAndDelete(id);
        if(!findCard) {
            return res.status(404).json({message:"There's no card to delete"});
        }
        return res.status(200).json({message:"Card delete Successfilly"});
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})

app.get('/api/v1/logout',(req,res) => {
    try{
       res.clearCookie('token',{
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none',
        })
        return res.status(200).json({ message: 'Logged out successfully' });
    }catch(err){
        return res.status(500).json({error: 'Internal Server Error',err})
    }
})



app.listen(process.env.PORT,() => {
    console.log(`Listening on port: ${process.env.PORT}`);
})