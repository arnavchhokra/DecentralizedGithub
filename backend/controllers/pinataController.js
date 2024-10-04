
const axios = require('axios');
const FormData = require('form-data');
const {upload} =   require("thirdweb/storage");
const fs = require('fs');
const path = require('path');
const { ThirdwebStorage } = require("@thirdweb-dev/storage"); // Correctly import ThirdwebStorage
//const { ThirdwebStorage } = require("@thirdweb-dev/sdk");




require("dotenv").config();
//const storage = new ThirdwebStorage();
const API_KEY = process.env.PINATA_API_KEY;
const API_SECRET = process.env.PINATA_API_SECRET;
const API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";


const THIRD_CLIENT = process.env.THIRD_CLIENT;
const THIRD_API = process.env.THIRD_API;
const THIRD_URL = `https://${THIRD_CLIENT}.ipfscdn.io/ipfs/`;

const store = new ThirdwebStorage({clientId:THIRD_CLIENT,secretKey:THIRD_API});

/*
exports.uploadFileToIPFS = async (req, res) => {
    try {
        const files = req.files; // Access the file from req.file
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }


        const ipfsHashes=[];

        const formData = new FormData();

        for(const file of files) {
            formData.append('file', file.buffer, { filename: file.originalname, filepath: file.originalname });

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': `multipart/form-data`,
                    'pinata_api_key': API_KEY,
                    'pinata_secret_api_key': API_SECRET,
                },
            });

            const ipfsHash = response.data.IpfsHash;
            ipfsHashes.push({
                ipfsHash,
                message:'Folder and Files Succesfully Pinned'
            });
        }
        res.json({ ipfsHashes });

    } catch (error) {
        console.error(`Failed to upload file to IPFS: ${error.message}`);
        res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
};*/
/*
exports.uploadFileToIPFS = async (req, res) => {
    try {
        const files = req.files; // Access the files from req.files (assuming multiple files)
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const ipfsHashes = [];

        for (const file of files) {
            const uploadResult = await upload(file.buffer, {
                uploadWithGatewayUrl: true, // You can use this option to get a gateway URL
                filename: file.originalname, // Keep the original file name
            });

            ipfsHashes.push({
                ipfsHash: uploadResult, // This is the IPFS CID returned by Thirdweb storage
                message: 'Folder and Files Successfully Pinned'
            });
        }

        res.json({ ipfsHashes });

    } catch (error) {
        console.error(`Failed to upload file to IPFS: ${error.message}`);
        res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
};
*/
/*
exports.uploadFileToIPFS = async (req, res) => {
    try {
        const files = req.files;  // Assuming you are using a middleware like multer to handle file uploads
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Create an array of File objects from the uploaded files
        const fileArray = files.map(file => new File([file.buffer], file.originalname));

        // Upload the files to IPFS
        const ipfsHashes = await upload({
            THIRD_CLIENT,
            files: fileArray,
        });

        // Return the IPFS hashes
        res.json({ ipfsHashes });
    } catch (error) {
        console.log("Could not Upload File to IPFS: " + error);
        return res.status(500).json({ error: "Failed to upload files to IPFS" });
    }
};*/


exports.uploadFileToIPFS = async (req, res) => {
    try {
        const files = req.files;  // Assuming you are using a middleware like multer to handle file uploads
        if (!files || files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Create an array of File objects from the uploaded files
        const fileArray = files.map((file) => ({
            path: file.originalname,
            content: new Blob([file.buffer]), // Create a Blob from the file buffer
        }));

     //   const ipfsHashes = await store.uploadBatch(files);
     const ipfsHashes = await store.uploadBatch(fileArray);
        // Return the IPFS hashes
        res.json({ ipfsHashes });
    } catch (error) {
        console.log("Could not Upload File to IPFS: " + error);
        return res.status(500).json({ error: "Failed to upload files to IPFS" });
    }
};


exports.retrieveFileFromIPFS = async (req, res) => {

};