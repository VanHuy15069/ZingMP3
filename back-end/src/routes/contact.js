import express from 'express';
import * as contactController from '../controller/contactController';
import * as middleware from '../middleware/authMiddleware';
const contactRouter = express.Router();
contactRouter.post('/create', contactController.createContact);
contactRouter.post('/feedback/:id', contactController.feedbackContact);
contactRouter.get('/get-all', middleware.authMiddleware, contactController.getAllContact);
contactRouter.delete('/delete', middleware.authMiddleware, contactController.deleteManyContacts);
export default contactRouter;
