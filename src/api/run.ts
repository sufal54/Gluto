import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true';

const LANGUAGE_MAP: Record<string, number> = {
    javascript: 63,
    c: 50,
    java: 62,
    rust: 73,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { code, language } = req.body;
    const langId = LANGUAGE_MAP[language];

    if (!langId) return res.status(400).json({ error: 'Unsupported language' });

    try {
        const response = await axios.post(
            JUDGE0_API,
            {
                source_code: code,
                language_id: langId,
            },
            {
                headers: {
                    'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({
            stdout: response.data.stdout,
            stderr: response.data.stderr,
            compile_output: response.data.compile_output,
            message: response.data.message,
            status: response.data.status,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}