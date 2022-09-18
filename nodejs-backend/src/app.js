const express = require('express');
const mongoose = require('mongoose');

const authRouter = require('./routers/auth.router');
const adminRouter = require('./routers/admin.router');


const app = express();

app.use(express.json());

app.use(authRouter);
app.use(adminRouter);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database connected successfully');
    }).catch((e) => {
        console.log(e);
    });

app.listen(3000, '0.0.0.0', () => {
    console.log(`Started successfully`);
});
