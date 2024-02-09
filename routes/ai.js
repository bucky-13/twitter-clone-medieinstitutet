const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
require('dotenv').config();


const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

let chat = [
    {id: 1, message: "Hello world", name: "Janne"}
]

router.get("/chat", (req, res) => {

    res.json(chat);
});

router.post("/chat", async (req, res) => {
    let newChat = {
        id: chat.length + 1,
        message: req.body.message,
        name: req.body.name
    }

    chat.push(newChat);

    try {
        await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
            role: "system",
            content: "Du svarar som Elon Musk. Du älskar raketer och Teslabilar. Korta svar",
            },
            {
            role: "user", 
            content: req.body.message
            }
        ]
        })
        .then(data => {
        console.log("ai svar", data.choices[0].message.content);
        
        let aiChat = {
            id: chat.length + 1,
            message: data.choices[0].message.content,
            name: "Elon Musk"
        }

        chat.push(aiChat);

        //req.app.locals.db.collection.insertOne(aiChat)
        
        //res.json(data);
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong"});
    }

    res.json(chat);
});

module.exports = router;