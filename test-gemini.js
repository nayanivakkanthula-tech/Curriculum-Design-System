
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
let apiKey = "AIzaSyCsvKuz6CnxPtbEw04-l_ZoqPHReC_MWEA";

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/VITE_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim();
    }
}

const ai = new GoogleGenAI({ apiKey });

async function test() {
    console.log(`Using Key: ${apiKey.substring(0, 10)}...`);
    const modelName = "models/gemini-1.5-flash";
    console.log(`Testing SDK with model: ${modelName}`);

    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: "Hello",
        });
        console.log("Success!");
        console.log(JSON.stringify(response, null, 2));
    } catch (e) {
        console.error("SDK Failed:");
        console.error(e.message);
        if (e.response) console.error(JSON.stringify(e.response, null, 2));
    }
}

test();
