const AWS = require('aws-sdk');
const fs = require('fs-extra');
const unzipper = require('unzipper');
const path = require('path');
const recursiveReaddir = require('recursive-readdir');


AWS.config.update({ region: 'ap-south-1' });
const s3 = new AWS.S3();

const s3Bucket = 'dece-git-temp';

exports.checkFileExists = async (key) => {
    const headParams = {
        Bucket: s3Bucket,
        Key: key,
    };
    try {
        await s3.headObject(headParams).promise();
        return true; // File exists
    } catch (headErr) {
        if (headErr.code === 'NotFound') {
            return false; // File doesn't exist
        }
        throw headErr; // Other errors
    }
};

exports.uploadFile = async (filePath, bucketName, s3Key) => {
    try {
        const fileStream = fs.createReadStream(filePath);

        const params = {
            Bucket: bucketName,
            Key: s3Key,
            Body: fileStream,
        };

        const result = await s3.upload(params).promise();
        console.log(`Uploaded file ${filePath} to ${s3Key}`);
        return result;
    } catch (error) {
        console.error(`Error uploading file ${filePath}:`, error);
        throw error; // Rethrow error for handling in the calling function
    }
};

exports.uploadDirectory = async (dirPath, bucketName, s3Prefix = '') => {
    try {
        const files = await recursiveReaddir(dirPath);

        console.log('Starting to upload');
        const uploadPromises = files.map(file => {
            const relativePath = path.relative(dirPath, file);
            const s3Key = path.join(s3Prefix, relativePath).replace(/\\/g, '/'); // Ensure forward slashes for S3 keys
            return exports.uploadFile(file, bucketName, s3Key);
        });

        await Promise.all(uploadPromises);
        console.log('All files uploaded successfully.');
    } catch (err) {
        console.error('Error uploading files:', err);
        throw err; // Rethrow error for handling in the calling function
    }
};


exports.downloadFile = (key) => {
    const downloadParams = {
        Bucket: s3Bucket,
        Key: key,
    };

    return s3.getObject(downloadParams).createReadStream();
};

exports.deleteFile = async (key) => {
    const deleteParams = {
        Bucket: s3Bucket,
        Key: key,
    };

    return await s3.deleteObject(deleteParams).promise();
};
