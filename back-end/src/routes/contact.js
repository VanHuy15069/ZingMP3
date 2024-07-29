import express from 'express';
import * as contactController from '../controller/contactController';
const contactRouter = express.Router();
contactRouter.post('/create', contactController.createContact);
contactRouter.post('/feedback/:id', contactController.feedbackContact);
export default contactRouter;
