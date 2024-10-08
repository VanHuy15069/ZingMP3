import express from 'express';
import * as nationController from '../controller/nationController';
import * as middleware from '../middleware/authMiddleware';
import * as upload from '../middleware/uploadFile';
const nationRouter = express.Router();
nationRouter.post('/create', middleware.authMiddleware, upload.uploadImage, nationController.createNation);
nationRouter.patch('/update/:id', middleware.authMiddleware, upload.uploadImage, nationController.updateNation);
nationRouter.delete('/delete', middleware.authMiddleware, nationController.deleteManyNation);
nationRouter.get('/get-all', nationController.getAllNation);
nationRouter.patch('/update-trash', middleware.authMiddleware, nationController.updateTrashNations);
nationRouter.get('/get-detail/:id', nationController.getDetailNation);
nationRouter.get('/get-songs', nationController.getSongsOfNation);
export default nationRouter;
