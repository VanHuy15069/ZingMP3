import express from 'express';
import * as playlistController from '../controller/playlistController';
import * as middleware from '../middleware/authMiddleware';
const playlistRouter = express.Router();
playlistRouter.post('/create/:id', middleware.authUserMiddleware, playlistController.createPlaylist);
playlistRouter.patch('/update/:id', playlistController.updatePlaylist);
playlistRouter.delete('/delete/:id', playlistController.deletePlaylist);
playlistRouter.post('/add-song', playlistController.addSongToPlaylist);
playlistRouter.get('/get-detail/:id', playlistController.getDetaiPlaylist);
playlistRouter.get('/get-all/:id', middleware.authUserMiddleware, playlistController.getAllPlaylist);
playlistRouter.delete('/remove-song', playlistController.removeSongToPlaylist);
export default playlistRouter;
