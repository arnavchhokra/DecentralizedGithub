// pinataController.js
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs').promises;
const fsSync = require('fs');
const s3Controller = require('./s3Controller');
const path = require('path')
const unzipper = require('unzipper');



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


exports.retrieveFileFromIPFS = async (req, res) => {
    const ipfsHash = req.params.ipfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/QmeAg8FkSts5XNi7wca2S5XJKZBwmAjudo5HbZgLfT6S4W`;
    const tempZipFilePath = path.join(__dirname, `${ipfsHash}.zip`);
    const tempUnzipFolderPath = path.join(__dirname, `${ipfsHash}`);
    const s3FolderKey = `${ipfsHash}`;

    try {
        // Step 1: Retrieve the zipped file from IPFS
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        console.log(response.data)
        if (response.status === 200) {
            // Step 2: Save the file temporarily on the server
            await fs.writeFile(tempZipFilePath, response.data);

            // Step 3: Unzip the file
            await fsSync.createReadStream(tempZipFilePath)
                .pipe(unzipper.Extract({ path: tempUnzipFolderPath }))
                .promise();

            // Step 4: Upload the unzipped contents to S3
            console.log("Starting to upload...");
            const uploadResults = await s3Controller.uploadDirectory(tempUnzipFolderPath, 'dece-git-temp', s3FolderKey); // Adjust bucket name and key
            console.log('Files uploaded successfully');

            // Step 5: Delete the local temporary files (both ZIP and unzipped)
               await fs.unlink(tempZipFilePath);
            await fs.rm(tempUnzipFolderPath, { recursive: true, force: true });

            // Return the list of uploaded files to the frontend
            res.json(uploadResults);

        } else {
            res.status(response.status).json({ error: 'Failed to retrieve file from IPFS' });
        }
    } catch (error) {
        res.status(500).json({ error: `Failed to retrieve file from IPFS: ${error.message}` });
    }
};