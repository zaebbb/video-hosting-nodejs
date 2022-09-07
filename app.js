const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const authRouter = require('./authRouter');

const app = express();

app.use(express.json())
app.use("/auth", authRouter)

app.get('/', (req, res) => {
    res.json('сервер работает')
})

const start = async() => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.vkskj.mongodb.net/RegistrationAuthorization?retryWrites=true&w=majority\n' +
            '\n', { useNewUrlParser: true })

        app.listen(PORT, () => {
            console.log(PORT)
            console.log('сервер запущен')
        });
    } catch (e) {
        console.log(e)
    }
}

start().then(r => {})