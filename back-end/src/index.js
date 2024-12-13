import express from 'express';
import bodyParser from 'body-parser';
import initRouters from './routes/index';
import connectDB from './config/connectDB';
import cors from 'cors';
import path from 'path';
require('dotenv').config();
const app = express();
app.use(
  cors({
    origin: process.env.FE_URL,
  }),
);
const port = process.env.PORT || 9090;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initRouters(app);
app.use('/src', express.static(path.join(__dirname, 'public')));
connectDB();
app.listen(port, () => {
  console.log('server is runing on the port: ' + port);
});
