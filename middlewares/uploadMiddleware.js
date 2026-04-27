const multer = require("multer");
const path = require("path");

//configure storage

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = path.join(__dirname, '../uploads');
        console.log("Upload destination:", dest);
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new Error('Only .jpg, .jpeg and .png formats are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;