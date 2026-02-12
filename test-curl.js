
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

console.log(`Using API Key: ${apiKey.substring(0, 5)}...`);

async function testFetch() {
    // List models
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log("Listing models...");
    let targetModel = "models/gemini-1.5-flash"; // Default

    try {
        const response = await fetch(listUrl);
        const json = await response.json();

        if (response.ok) {
            const models = json.models || [];
            console.log(`Found ${models.length} models.`);
            const flashModels = models.filter(m => m.name.includes('flash'));
            if (flashModels.length > 0) {
                targetModel = flashModels[0].name;
                console.log(`Found flash models: ${flashModels.map(m => m.name).join(', ')}`);
                console.log(`Selected: ${targetModel}`);
            } else {
                console.log("No flash models found, looking for ANY gemini model...");
                const geminiModels = models.filter(m => m.name.includes('gemini'));
                if (geminiModels.length > 0) {
                    targetModel = geminiModels[0].name;
                    console.log(`Selected: ${targetModel}`);
                }
            }
        } else {
            console.log("List Failure:", JSON.stringify(json, null, 2));
        }

    } catch (e) {
        console.error("List Error:", e.message);
    }

    // Try Generate Content with the found model
    // targetModel includes 'models/' prefix usually.
    // URL expects models/name:generateContent?
    // Wait, if targetModel is 'models/gemini-1.5-flash', then URL should be .../v1beta/models/gemini-1.5-flash:generateContent

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/${targetModel}:generateContent?key=${apiKey}`;
    console.log(`\nAttempting generateContent with: ${genUrl}`);

    const data = {
        contents: [{
            parts: [{ text: "Hello" }]
        }]
    };

    try {
        const response = await fetch(genUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const json = await response.json();
        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
            console.log("Success! Response Text:", json.candidates?.[0]?.content?.parts?.[0]?.text || "No text");
        } else {
            console.log("Gen Failure:", JSON.stringify(json, null, 2));
        }
    } catch (e) {
        console.error("Gen Error:", e.message);
    }
}

testFetch();
