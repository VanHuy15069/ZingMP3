import express from 'express';
import * as categoryController from '../controller/categoryController';
import * as middleware from '../middleware/authMiddleware';
import * as upload from '../middleware/uploadFile';
const categoryRouter = express.Router();
categoryRouter.post('/create', middleware.authMiddleware, upload.uploadImage, categoryController.createCategory);
categoryRouter.patch('/update/:id', middleware.authMiddleware, upload.uploadImage, categoryController.updateCategory);
categoryRouter.get('/get-all', categoryController.getAllCategory);
categoryRouter.delete('/delete', middleware.authMiddleware, categoryController.deleteManyCategories);
categoryRouter.patch('/update-trash', middleware.authMiddleware, categoryController.updateTrashCategories);
categoryRouter.get('/get-detail/:id', categoryController.getDetailCategory);
export default categoryRouter;
