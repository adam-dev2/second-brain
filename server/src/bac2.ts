export const createCard = async(req:Request,res:Response) => {
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
        
        // --- SAVING IN MONGO
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

        // --- SAVING IN qDRANT 
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
        
        console.log(`Storing Card title: ${newCard.title}`);
        console.log(`Card Stored successfully with ID: ${newCard.id}`);
        
        return res.status(201).json({ message: 'Card created successfully', card: newCard });
    } catch (err) {
        console.error('Error creating card:', err);
        return res.status(500).json({ error: 'Internal Server Error', details: err });
    }
}

export const EditCard = async(req:Request,res:Response) => {
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
}