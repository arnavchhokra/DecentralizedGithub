import { NextResponse } from 'next/server';
import Moralis from 'moralis';

export async function POST(req: Request) {
    try {
        const { abi } = await req.json();

        if (!process.env.MORALIS_API_KEY) {
            throw new Error('MORALIS_API_KEY is not defined');
        }

        // Initialize Moralis for each request
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
        });

        const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });

        return NextResponse.json(response.toJSON());

    } catch (error) {
        console.error('Error uploading to Moralis:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload to Moralis' },
            { status: 500 }
        );
    }
}