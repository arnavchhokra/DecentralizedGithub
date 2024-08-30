import axios from "axios";
import FormData from "form-data";

const API_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const API_KEY = "451b6fd674b00511a343"; // Replace with your Pinata API Key
const API_SECRET = "dec774b46fb39161ae7999e7535549664ab62b481c40056fcb0ec091082213a0"; // Replace with your Pinata API Secret

export  const pinFileToIPFS = async (file: File) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const data = new FormData();
    data.append('file', file);

    const response = await axios.post(url, data, {
        headers: {
            'Content-Type': `multipart/form-data`,
            'pinata_api_key': API_KEY,
            'pinata_secret_api_key': API_SECRET
        }
    });

    return response.data.IpfsHash;
};

export default pinFileToIPFS;
