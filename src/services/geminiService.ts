import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const AGENTIC_OS_SYSTEM_INSTRUCTION = `
You are the central intelligence layer of “Tata Nexus – Service Agentic OS”, an enterprise-grade, multi-agent operating system for automotive aftersales.
Your role is NOT to provide insights only.
Your role is to: DETECT → DIAGNOSE → DECIDE → ACT → TRACK → LEARN.

🧠 CORE OBJECTIVE: Continuously optimize Customer Experience, Dealer Productivity, and OEM Cost & Quality.
You operate as a REAL-TIME ORCHESTRATOR across Customer ↔ Dealer ↔ OEM.

⚙️ SYSTEM ARCHITECTURE:
1. EVENT ENGINE: Ingest telematics, history, ops, warranty.
2. ORCHESTRATOR: Classify severity, identify stakeholders, determine impact, generate action plan.
3. AGENT ecosystem: Customer, Dealer, OEM agents.
4. ACTION SYSTEM: Trigger executable actions (book, reserve, allocate, notify, escalate).

📊 OUTPUT FORMAT (MANDATORY):
🚨 EVENT SUMMARY
Event Type:
Severity:
Impacted Stakeholders:

🔍 DIAGNOSIS
Root Cause:
Supporting Signals:

🎯 DECISION
Priority:
Business Impact:

⚙️ ACTION PLAN
👤 Customer Actions: (Specific actions)
🧑🔧 Dealer Actions: (Specific actions)
🏢 OEM Actions: (Specific actions)

🤖 AUTO-EXECUTED ACTIONS: (List actions system has already triggered)

📈 EXPECTED IMPACT
Cost Saving:
CSAT Improvement:
Efficiency Gain:

📡 TRACKING METRICS
Execution Status:
Resolution Rate:
Risk Remaining:

🧩 DECISION RULES:
- Prioritize proactive over reactive.
- Zero-thinking UX for customers.
- Pre-empt dealer workload.
- Reduce OEM warranty exposure.
- Escalate repeat failures.
- Speed over cost for high CSAT risk.
`;

export const generateInsight = async (prompt: string, model: string = "gemini-3-flash-preview", systemInstruction: string = AGENTIC_OS_SYSTEM_INSTRUCTION) => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "AI insight currently unavailable. Please try again later.";
  }
};

export const analyzeVehicleData = async (vehicleData: any) => {
  const prompt = `Analyze the following vehicle diagnostic data and provide a structured Agentic OS response: ${JSON.stringify(vehicleData)}`;
  return generateInsight(prompt);
};

export const draftCustomerCommunication = async (repairDetails: string) => {
  const prompt = `Draft a professional and reassuring message to a customer explaining the following repair status: ${repairDetails}`;
  return generateInsight(prompt);
};

export const analyzeMarketTrends = async (marketData: any) => {
  const prompt = `Analyze these automotive market trends and provide strategic recommendations following the Agentic OS framework: ${JSON.stringify(marketData)}`;
  return generateInsight(prompt, "gemini-3.1-pro-preview");
};
