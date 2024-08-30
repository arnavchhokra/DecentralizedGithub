// pinataController.js
const axios = require('axios');
const FormData = require('form-data');
const AdmZip = require('adm-zip')
const fs = require('fs-extra')
const tmp = require('tmp')
const os = require('os')


require("dotenv").config();

const API_KEY = process.env.PINATA_API_KEY;
const API_SECRET = process.env.PINATA_API_SECRET;
const API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

exports.uploadFileToIPFS = async (req, res) => {
    try {
        const file = req.file; // Access the file from req.file
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        if (file.mimetype !== "application/zip") {
            return res.status(400).send("Please upload a ZIP file.");
        }

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname); // Use file.buffer and file.originalname

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': `multipart/form-data`,
                'pinata_api_key': API_KEY,
                'pinata_secret_api_key': API_SECRET,
            },
        });

        const ipfsHash = response.data.IpfsHash;
        res.json({ ipfsHash });

    } catch (error) {
        console.error(`Failed to upload file to IPFS: ${error.message}`);
        res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
};


const downloadFile = async (url, dest) => {
    const writer = fs.createWriteStream(dest);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        throw new Error(`Error downloading file: ${error.message}`);
    }
};


// Retrieve and process file from IPFS
exports.retrieveFileFromIPFS = async (req, res) => {
    const ipfsHash = req.params.ipfsHash; // Assume IPFS hash is passed in the request
   const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
 // const url = `https://gateway.pinata.cloud/ipfs/QmSfUzc1bhqPrb4pKhPn63K2iFk3wf8xrGAhEKENvrVJCw`; 
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });

        if (response.status === 200) {
            // Set appropriate content type if known or default to binary/octet-stream
            res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream');
            res.send(response.data);
        } else {
            res.status(response.status).json({ error: 'Failed to retrieve file from IPFS' });
        }
    } catch (error) {
        res.status(400).json({ error: `Failed to retrieve file from IPFS: ${error.message}` });
    }
};
