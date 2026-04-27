const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController")
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

// Auth Routes

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

router.post("/register", registerUser);  //register user
router.post("/login", loginUser);  //login User
router.get("/profile", protect, getUserProfile);  //Get User Profile

router.post("/upload-image", (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ message: err.message || "File upload failed" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        res.status(200).json({ imageUrl });
    });
}); 

module.exports = router;