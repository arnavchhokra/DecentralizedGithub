const express = require('express')
const multer = require('multer')

const pinata = require('../controllers/pinataController')
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/upload',upload.array('files'),pinata.uploadFileToIPFS)
router.get('/retrieve/:ipfsHash',pinata.retrieveFileFromIPFS)
module.exports = router;

