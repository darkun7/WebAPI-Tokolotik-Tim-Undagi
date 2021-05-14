const multer  = require('multer');

const diskStorageToUploads = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const uploadFile = multer({storage: diskStorageToUploads});

module.exports = {
    uploadFile: uploadFile.single('file')
}