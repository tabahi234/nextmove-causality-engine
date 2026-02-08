const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config(); 

const API_KEY = process.env.GEMINI_API_KEY; 


console.log("System Status: Loading Credentials...");
if (!API_KEY) {
    console.error("CRITICAL ERROR: API Key is STILL missing. Check .env file formatting.");
} else {
    console.log("SUCCESS: API Key Loaded Securely.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const MODEL_HIERARCHY = [
  "gemini-3-flash-preview", 
  "gemini-2.5-flash",       
  "gemini-2.0-flash-exp",
  "gemini-1.5-flash"
];

exports.predictOutcome = onRequest({ cors: true }, async (request, response) => {
  if (request.method !== "POST") return response.status(405).send({ error: "Method Not Allowed" });

  const { scenario, mode, userProfile } = request.body;
  if (!scenario || scenario.length > 2000) {
    return response.status(400).send({ error: "Scenario invalid or too long." });
  }


  const name = userProfile?.name || "User";
  const role = userProfile?.role || "Person";
  const profileContext = `
    USER IDENTITY: Name: "${name}", Role: ${role}, Vibe: ${userProfile?.vibe || "Balanced"}.
    (Address user as ${name}. Do not end script with a question.)
  `;

  let behavior = mode === "diplomatic" 
    ? `MODE: DIPLOMATIC. User (${name}) uses tactical empathy. Outcome: Positive.`
    : `MODE: REALISTIC. User (${name}) acts impulsively. Outcome: Negative.` ;

  const prompt = `
    You are 'NextMove'. 
    ${profileContext}
    SCENARIO: "${scenario}"
    ${behavior}

    INSTRUCTIONS:
    1. Write a 3-turn dialogue.
    2. Prediction: 2 sentences.
    3. Risk Score: 0-100.
    4. Tactical Advice: 3 tips.

    OUTPUT JSON ONLY:
    { "script": [{"speaker":"", "line":""}], "risk_score": 0, "prediction": "", "tactical_advice": [] }
  `;

  let lastError = null;

  for (const modelName of MODEL_HIERARCHY) {
    try {
      console.log(`Attempting Model: ${modelName}...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const cleanJson = text.replace(/```json|```/g, "").trim();
      const data = JSON.parse(cleanJson);

  
      return response.status(200).send({ 
        ...data, 
        model_used: modelName 
      });

    } catch (error) {
      console.warn(`Model ${modelName} Failed:`, error.message);
      lastError = error;
   
    }
  }

  console.error("TOTAL SYSTEM FAILURE.");
  response.status(500).send({ error: "System Overload.", details: lastError?.message });
});