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
import passport from "./config/passport.js";
import oauthRoutes from "./routes/oauthRoutes.js";
import nodemailer from "nodemailer"


const app = express();
dotenv.config();
ConnectDB();
ConnectQdrant();

interface IAns {
    id: string | Number;
    score: Number;
    payload?:
    | {
        userId: string;
        title: string;
      }
    | Record<string, unknown>
    | null
    | undefined;
}

interface CookieOptions {
    httpOnly: boolean;
    secure: boolean;
    maxAge: number;
    sameSite: 'strict'|'lax'|'none';
}

interface IAllCards {
    userId:string;
    link: string;
    title: string;
    type: string;
    tags:string[];
    share:boolean;
    embedding?:number[];
    cardId:string;
    createdAt:Date;
    updatedAt:Date;
}

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER!,
        pass:process.env.EMAIL_PASS!
    },
})

app.use(express.json());

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(passport.initialize());
app.use("/api/v1/auth", oauthRoutes);



app.get('/api/v1/',(req,res) => {
    return res.status(200).json({message:"Server is asdasdasd"})
})

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
        console.log(token);
        
        res.cookie('token',token,cookieOptions);
        res.status(201).json({message: 'User created successfully',username,email})
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
            sameSite:'none'
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

app.post('/api/v1/forgotPassword',async(req,res) => {
    const {email} = req.body;
    console.log(email);
    
    try {
        const findUser = await User.findOne({email});
        if(!findUser) {
            return res.status(401).json({message:"User with this email doesn't exist"})
        }
        const token = jwt.sign({id:findUser._id},process.env.RESET_SECRET!,{expiresIn:'15m'});
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await transporter.sendMail({
            from:`"Second Brain" ${process.env.EMAIL_USER}`,
            to:email,
            subject:'Reset Your Password',
            html:`<p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
        });
        res.json({message:'Password reset email sent'});
    }catch(err) {
        console.log(err);
        return res.status(500).json({message: 'Internal Server Error',err})
    }
 })

app.post('/api/v1/reset-password',async(req,res) => {
    const {token,newPassword} = req.body;
    try {   
        const decoded = jwt.verify(token,process.env.RESET_SECRET!) as {id: string};
        const user = await User.findById(decoded.id);
        console.log(user?.username);
        
        if(!user) {
            return res.status(400).json({message:"Invalid or expired token"});
        }
        if(!newPassword) {
            return res.status(400).json({message:'new Password is required'})
        }
        let hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        console.log(hashedPassword);
        
        await user.save();
        return res.status(200).json({message:'Password reset succesfully'});
    }catch(err) {
        console.log(err);
        return res.status(400).json({message: 'Invalid or expired token'})
    }
})

app.get('/api/v1/user',AuthMiddleware,async(req,res) => {
    const userId = req.user?.id;
    if(!userId) {
        return res.status(401).json({message:'UnAuthroized'});
    }
    try {
        const findUser = await User.findById(userId);
        if(!findUser) {
            return res.status(404).json({message: 'No User Found'});
        }
        let userProfile = {
            username: findUser.username,
            email:findUser.email,
            avatar:findUser.avatar
        }
        res.status(200).json({userProfile:userProfile})
    }catch(err) {
        return res.status(500).json({message:'Internal Server Error',err})
    }
})

app.post('/api/v1/userconfirmation',AuthMiddleware,async(req,res) => {
    const id = req.user?.id;
    const {password} = req.body;
    if(!id) {
        return res.status(401).json({message:'UnAuthroized'});
    }
    if(!password) {
        return res.status(400).json({message:'Please enter the current password'})
    } 
    try {
        let findUser = await User.findById(id)
        if(!findUser) {
            return res.status(404).json({message:"User with this email doesn't exists"});
        }
        let comparePassword = await bcrypt.compare(password,findUser.password);
        if(!comparePassword) {
            return res.status(401).json({message: 'Invalid Password'});
        }
        return res.status(200).json({message:'User password confirmed'})
    }catch(err) {
        return res.status(500).json({message:'Internal Server Error',err})
    }
})

app.put('/api/v1/profile',AuthMiddleware,async(req,res) => {
    const userId = req.user?.id;
    const {username,email,password,avatar} = req.body;
    if(!userId) {
        return res.status(401).json({message:'UnAuthroized'});
    }
    if(!password) {
        return res.status(400).json({message:'Please enter the current password in the password section'})
    }
    let hashedPassword = await bcrypt.hash(password,10);
    try {
        const findUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                password:hashedPassword,
                avatar,
                updatedAt: new Date().toISOString()
            }
        )
        let userProfile = {
            username: findUser?.username,
            email: findUser?.email
        }
        return res.status(200).json({message:"User profile updated successfully",userProfile:userProfile})
    }catch(err) {
        return res.status(500).json({message:'Internal Server Error',err})
    }
})

app.get('/api/v1/metrics', AuthMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); 
        startOfWeek.setHours(0, 0, 0, 0);

        const totalCards = await Content.countDocuments({ userId });
        const cardsLastWeek = await Content.countDocuments({
            userId,
            createdAt: { $gte: fourteenDaysAgo.toISOString(), $lt: sevenDaysAgo.toISOString() }
        });
        const cardsThisWeek = await Content.countDocuments({
            userId,
            createdAt: { $gte: sevenDaysAgo.toISOString() }
        });
        const cardsBeforeLastWeek = totalCards - cardsThisWeek;
        const cardsChangePercent = cardsBeforeLastWeek > 0 
            ? Number(((cardsThisWeek / cardsBeforeLastWeek) * 100).toFixed(1))
            : 0;
        const allCards = await Content.find({ userId }, { tags: 1 });
        const uniqueTags = new Set<string>();
        allCards.forEach(card => {
            card.tags?.forEach((tag: string) => uniqueTags.add(tag));
        });
        const totalTags = uniqueTags.size;
        const oldCards = await Content.find({
            userId,
            createdAt: { $lt: sevenDaysAgo.toISOString() }
        }, { tags: 1 });
        const oldUniqueTags = new Set<string>();
        oldCards.forEach(card => {
            card.tags?.forEach((tag: string) => oldUniqueTags.add(tag));
        });
        const tagsChange = totalTags - oldUniqueTags.size;


        const Allcards:IAllCards[] = await Content.find({userId})
        const sharedCards = Allcards.filter(item => item.share === true).length 
        console.log(sharedCards);


        const aiSearches = sharedCards
        const searchesChange = -3.2;
        const weeklyActivity = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(now.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);
            
            const cardsCount = await Content.countDocuments({
                userId,
                createdAt: { 
                    $gte: dayStart.toISOString(), 
                    $lte: dayEnd.toISOString() 
                }
            });
            
            weeklyActivity.push({
                day: days[dayStart.getDay()],
                cards: cardsCount
            });
        }
        const tagCount: { [key: string]: number } = {};
        allCards.forEach(card => {
            card.tags?.forEach((tag: string) => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });

        const topTags = Object.entries(tagCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, count], index) => {
                const colors = [
                    'bg-blue-500',
                    'bg-yellow-500',
                    'bg-green-500',
                    'bg-purple-500',
                    'bg-pink-500'
                ];
                return {
                    name,
                    count,
                    color: colors[index]
                };
            });
        const recentCards = await Content.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title type tags createdAt link');

        const formattedRecentCards = recentCards.map(card => {
            const createdDate = new Date(card.createdAt);
            const diffMs = now.getTime() - createdDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let createdAt;
            if (diffMins < 60) {
                createdAt = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
            } else if (diffHours < 24) {
                createdAt = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
            } else {
                createdAt = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
            }

            return {
                id: card._id,
                title: card.title,
                type: card.type,
                tags: card.tags,
                createdAt
            };
        });

        const metrics = {
            stats: {
                totalCards,
                cardsChangePercent,
                tags: totalTags,
                tagsChange,
                aiSearches,
                searchesChange,
                thisWeek: cardsThisWeek
            },
            weeklyActivity,
            topTags,
            recentCards: formattedRecentCards
        };

        return res.status(200).json({ metrics });
    } catch (err) {
        console.error('Error fetching metrics:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err });
    }
});

app.post('/api/v1/card', AuthMiddleware, async (req, res) => {
    const { link, title, type, share } = req.body;
    const tags = req.body.tags;
    
    if (!link || !title || !type) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (!tags || tags.length < 1) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const qdrantID = uuidv4();
        const embeddings = await getEmbedding(title);

        await qdrantClient.upsert(COLLECTION_NAME, {
            wait: true,
            points: [
                {
                    id: qdrantID,
                    vector: embeddings,
                    payload: {
                        cardId: qdrantID,
                        userId: userID,
                        title: title,
                    },
                },
            ],
        });
        
        const newCard = new Content({
            userId: userID,
            cardId: qdrantID,
            link,
            title,
            type,
            tags,
            share,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        await newCard.save();
        console.log(`Storing Card title: ${newCard.title}`);
        console.log(`Card Stored successfully with ID: ${newCard.id}`);
        
        return res.status(201).json({ message: 'Card created successfully', card: newCard });
    } catch (err) {
        console.error('Error creating card:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err });
    }
});

app.put('/api/v1/editCard/:id', AuthMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { link, title, share, tags } = req.body;
        if (!link || !title || !tags) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const findCard = await Content.findById(id);
        console.log(findCard, "testing");
        
        if (!findCard) {
            return res.status(404).json({ message: 'Card with that id not found' });
        }
        const currentUserId = req.user?.id;
        if (findCard.userId.toString() !== currentUserId) {
            return res.status(403).json({ message: 'Unauthorized to edit this card' });
        }
        
        if (findCard.title !== title) {
            const cardId: string = findCard.cardId;
            console.log('Updating Qdrant for cardId:', cardId);
            
            try {
                const newTitleEmbeddings = await getEmbedding(title);
                const result = await qdrantClient.retrieve(COLLECTION_NAME, { ids: [cardId] });
                
                if (result && result.length > 0) {
                    const point = result[0];
                    await qdrantClient.upsert(COLLECTION_NAME, {
                        wait: true,
                        points: [
                            {
                                id: cardId,
                                vector: newTitleEmbeddings,
                                payload: {
                                    cardId: cardId,
                                    userId: currentUserId,
                                    title: title,
                                },
                            },
                        ],
                    });
                    console.log("Qdrant updated successfully for cardId:", cardId);
                } else {
                    console.log("Card not found in Qdrant:", cardId);
                }
            } catch (qdrantErr) {
                console.error("Error updating Qdrant:", qdrantErr);
            }
        }
        
        const updateCard = await Content.findByIdAndUpdate(
            id,
            {
                link,
                title,
                share,
                tags,
                updatedAt: new Date().toISOString()
            },
            { new: true } 
        );
        
        return res.status(200).json({ 
            message: "Updated card successfully", 
            card: updateCard 
        });
    } catch (err: any) {
        console.error('Error updating card:', err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

app.post('/api/v1/query', AuthMiddleware, async (req, res) => {
    const query = req.body.query;
    let limit = req.body.limit;
    console.log(query, " ------- ------ ----  ", limit);
    
    if (!query ) {
        return res.status(400).json({ message: "query missing" });
    }
    if(!limit) {
        limit = 1;
    }
    try {
        const userID = req.user?.id;
        if (!userID) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const queryEmbeddings = await getEmbedding(query);
        
        const searchResults = await qdrantClient.search(COLLECTION_NAME, {
            vector: queryEmbeddings,
            limit: Number(limit),
            filter: {
                must: [
                    {
                        key: "userId",
                        match: { value: userID }
                    }
                ]
            }
        });

        const titles: any = [];
        searchResults.forEach((res) => {
            if (res.payload?.title) {
                titles.push(res.payload.title);
            }
        });
        
        console.log('Found titles:', titles);
        const queryCards = await Content.find({ 
            title: { $in: titles },
            userId: userID 
        });
        const titleScoreMap = new Map();
        searchResults.forEach(res => {
            if (res.payload?.title) {
                titleScoreMap.set(res.payload.title, res.score);
            }
        });
        const cardsWithScores = queryCards.map(card => ({
            ...card.toObject(),
            relevanceScore: titleScoreMap.get(card.title) || 0
        })).sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        return res.status(200).json({ 
            queryCards: cardsWithScores
        });
    } catch (err: any) {
        console.error('Error querying cards:', err);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            details: err.message || err 
        });
    }
});

app.get('/api/v1/cards',AuthMiddleware,async(req,res) => {
    try{
        const userID = req.user?.id;
        
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
        
        return res.status(200).json({message:'Sharelink Generated Successfully',ShareableLink:`${shareHash}`})
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
        res.clearCookie('token',{
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'none',
        })
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