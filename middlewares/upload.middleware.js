const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public'));
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `${req.params.id}-${Date.now()}${extension}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        return cb(null, true);
    }
    const err = new Error('Only image files are allowed');
    err.status = 400;
    cb(err);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 }
});

const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (!err) return next();
        if (err.code === 'LIMIT_FILE_SIZE') {
            err.message = 'File is too large (max 1MB)';
            err.status = 400;
        }
        next(err);
    });
};

module.exports = uploadImage;