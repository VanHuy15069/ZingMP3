import fs from 'fs';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, '..', '', 'public'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadImage = multer({
  storage: storage,
  limits: { fileSize: '1000000' },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb('Give proper files formate to upload');
  },
}).single('image');

export const uploadSong = multer({
  storage: storage,
  limits: { fileSize: '10000000' },
}).single('link');

export const uploadManyFiles = multer({ storage: storage }).fields([
  { name: 'link', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

export const clearFile = (file) => {
  const clearFile = path.resolve(__dirname, '..', '', `public/${file}`);
  fs.unlinkSync(clearFile);
};
