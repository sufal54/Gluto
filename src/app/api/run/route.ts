import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import axios from 'axios';

const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

const LANGUAGE_MAP: Record<string, { version: string; filename: string }> = {
    javascript: { version: '18.15.0', filename: 'main.js' },
    c: { version: '10.2.0', filename: 'main.c' },
    java: { version: '15.0.2', filename: 'Main.java' },
    rust: { version: '1.68.2', filename: 'main.rs' },
};

export async function POST(req: NextRequest) {
    const { code, language } = await req.json();
    const config = LANGUAGE_MAP[language];

    if (!config) {
        return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
    }

    try {
        const response = await axios.post(
            PISTON_API,
            {
                language,
                version: config.version,
                files: [
                    {
                        name: config.filename,
                        content: code,
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return NextResponse.json({
            stdout: response.data.run.stdout,
            stderr: response.data.run.stderr,
            code: response.data.run.code,
        });
    } catch (error: any) {
        console.error(error.response?.data || error.message);
        return NextResponse.json({ error: 'Execution failed' }, { status: 500 });
    }
}
