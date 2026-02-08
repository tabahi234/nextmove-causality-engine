# 🔮 NextMove - AI Causality Engine
### 🏆 Submission for Gemini Hackathon / Google DeepMind 2026

**NextMove** is a fate simulator that stops you from making bad decisions. 

It uses a **multi-model AI architecture** (The "Hydra Protocol") to analyze risky text messages, predict the social fallout, and offer a "Diplomatic Fix" using tactical empathy.

## 📺 [Watch the Demo Video](https://youtu.be/9C9ogZ07Q5w)

---

## 🧠 The "Hydra Protocol" Architecture
NextMove doesn't just rely on one model. It chains Google's best models together for maximum intelligence and 100% uptime.

```mermaid
graph TD
    A[User Input] --> B{Risk Analysis}
    B -- High Risk --> C[Gemini 3.0 Preview]
    B -- Standard Query --> D[Gemini 2.5 Flash]
    C -- Quota Exceeded --> D
    D -- API Error --> E[Gemini 1.5 Flash Backup]
    C --> F[Diplomatic Output]
    D --> G[Reality Check Output]
