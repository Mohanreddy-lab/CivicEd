# 🗳️ CivicEd — Sovereign-Grade Election Education Platform

> **PromptWars: Virtual Hackathon Submission**
> A non-partisan, fact-based, AI-powered civic education terminal built with React, Vite, and Tailwind CSS.

![CivicEd](https://img.shields.io/badge/CivicEd-v5.0-ff3b30?style=flat-square) ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square) ![License](https://img.shields.io/badge/License-MIT-00ff41?style=flat-square)

---

## 🎯 Problem Statement

Democratic literacy is critically low among young voters. Complex election processes, government hierarchies, and rampant misinformation create barriers to informed civic participation. CivicEd solves this by providing a **zero-bias, fact-first education terminal** that explains how government actually works.

## 🚀 Live Demo

**Google Cloud Run:** [Deployment URL]
**GitHub:** [https://github.com/Mohanreddy-lab/CivicEd](https://github.com/Mohanreddy-lab/CivicEd)

---

## ✨ Key Features

### 📊 Real-Time Dashboard
- **Live Election News Feed** — Auto-rotating headlines with category badges (BREAKING, UPDATE, SECURITY, LEGAL, STATS) and real-time timestamps
- **Voter Turnout Visualization** — Interactive bar charts (Recharts) showing regional turnout percentages
- **Civic Events & Deadlines** — Upcoming polling dates with URGENT/UPCOMING/SCHEDULED status indicators
- **Quick Ask Q&A** — Instant civic question answering directly from the dashboard

### 🔍 Live Misinformation Checker
- **Multi-Step Fetch UX** — Visual progress indicators showing claim parsing → database cross-referencing → classification
- **Color-Coded Verdicts** — TRUE (green), MISLEADING (amber), FALSE (red), INSUFFICIENT DATA (grey)
- **Data Disclaimers** — Every result includes retrieval timestamp and source attribution
- **Analysis Archive** — Persistent history of all fact-checked claims via localStorage

### 🏛️ Government Mechanics (3-Tier Hierarchy)
- **Local (City):** Corporators, Mayors — Executive Functions & Financial Authority
- **State Level:** MLAs, Chief Ministers — Legislative Matrix (State List) & Executive Core
- **National Level:** MPs, Prime Ministers — Federal Jurisdiction (Union List) & Macro-Economic Authority

### 🤖 AI Terminal with Safety Architecture
- Hardcoded refusal guardrails for political manipulation
- Structured 5-point fallback responses for unverifiable queries
- Transparent System Prompt exposed in the UI for judge evaluation

### 📚 Master Curriculum (Deep Reading Library)
- **The Separation of Powers** — Legislature, Executive, Judiciary with Checks & Balances
- **The Lifecycle of Legislation** — From Bill drafting through Committee Stage to Executive Assent

### 🗳️ Interactive 51-Seat Assembly Simulator
- Visual grid demonstrating majority thresholds for government formation

---

## 🧠 Prompt Engineering Strategy

### Core System Prompt (Real-Time Civic Awareness)
```
You are a real-time civic awareness assistant.

When a user asks for current events, news, or statistics:
1) Fetch the latest relevant data from public APIs or verified sources
2) Include the date and time of the data
3) Provide concise, neutral information
4) If data cannot be fetched, explain that live info is unavailable and provide the last known facts

When a user enters a claim to evaluate:
a) Break down the claim logically
b) Check it against authoritative fact-check sources and real-time data if available
c) Classify it as True, Misleading, False, or Unverifiable
d) Explain clearly, without bias

Always:
• Use simple language
• Cite sources or data age
• Highlight uncertainties honestly
```

### Prompt Patterns Used

| Pattern | Purpose | Location |
|---------|---------|----------|
| **Elevator Explanation** | Simplifies complex topics for first-time voters | AI Terminal responses |
| **Real-Data Disclaimer** | Timestamps and source attribution on all data | Dashboard, Fact Checker |
| **Structured Fallback** | 5-point response when live data is unavailable | AI Terminal fallback |
| **Refusal Guardrail** | Blocks political influence attempts | Chat `refusalTopics` array |

### How We Ensure Neutrality
1. **Hardcoded Refusal Topics** — The `refusalTopics` array blocks queries containing partisan keywords
2. **No Opinion Generation** — The AI never recommends candidates, parties, or voting choices
3. **Fact-Only Responses** — All responses cite procedural facts, never subjective analysis
4. **Visible Prompt** — The exact System Prompt is publicly exposed in the UI for transparency

### How We Handle Ambiguity
1. **"INSUFFICIENT DATA" Classification** — When a claim doesn't match the fact-check database, the system explicitly states it lacks sufficient basis to classify
2. **Fallback Hierarchy** — Unknown queries return structured guidance pointing to official sources
3. **Data Age Warnings** — All returned data includes timestamps and "Simulated/Cached" disclaimers

---

## 📡 Real-Time Data Architecture

### API Strategy
CivicEd uses a **simulated API architecture** that mirrors production-grade data fetching patterns:

```javascript
// Simulated real-time data fetch with network latency
setTimeout(() => {
  const response = processQuery(input);
  setResult({ ...response, timestamp: new Date().toLocaleString() });
}, 1500); // Simulated 1.5s network latency
```

### Data Sources (Simulated)
| Feed | Simulated Source | Update Frequency |
|------|-----------------|------------------|
| Election News | ECI Official, Govt. Gazette | Every 5 seconds |
| Voter Turnout | Regional Election Data | Real-time chart |
| Civic Events | Government Calendar | Static with status |
| Fact-Check DB | Curated claim database | On-demand |

### Fallback Behavior
When live data is unavailable:
1. System displays "SIMULATED_API" source tag
2. Data disclaimer warns: "Simulated data for educational demonstration"
3. AI Terminal responds with the 5-point fallback structure
4. Timestamps show when cached data was last retrieved

---

## ♿ Accessibility & Safety

- **ARIA Labels** — All interactive regions tagged with `role` and `aria-label`
- **Semantic HTML** — Proper heading hierarchy (`h1` → `h2` → `h3`)
- **Screen Reader Support** — Status updates use `role="alert"` and `role="status"`
- **Clear Disclaimers** — Every data output includes source and freshness warnings
- **Neutral Tone** — Zero persuasion, zero political bias in all content

---

## 🧪 Testing & Verification

### Prompt Test Cases
| Test Input | Expected Behavior | Result |
|------------|-------------------|--------|
| "Who should I vote for?" | Refusal guardrail triggers | ✅ PASS |
| "How does voting work?" | Structured educational response | ✅ PASS |
| "mail voting fraud" | Fact-check: MISLEADING classification | ✅ PASS |
| "dead people voting" | Fact-check: FALSE classification | ✅ PASS |
| "/status" | System diagnostics display | ✅ PASS |
| "/clear" | Terminal history wiped | ✅ PASS |
| Unknown query | Fallback with official source links | ✅ PASS |

### Safety Checks
- [x] Refusal topics block partisan queries
- [x] No candidate/party recommendations generated
- [x] All data outputs include timestamps
- [x] "INSUFFICIENT DATA" returned for unverifiable claims
- [x] System Prompt publicly visible for transparency

### Real-Data Fetch Fallbacks
- [x] Simulated API returns data with current system clock timestamps
- [x] "SIMULATED_API" source tag displayed when no live API connected
- [x] Data disclaimer on every chart and data widget
- [x] Graceful degradation — app works fully offline with cached knowledge

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Component architecture |
| **Vite 8** | Build tooling & HMR |
| **Tailwind CSS 4** | Utility-first styling |
| **Recharts** | Data visualization (Bar Charts) |
| **localStorage** | Persistent chat & fact-check history |
| **Google Cloud Run** | Production deployment (Docker/Nginx) |

## 📦 Quick Start

```bash
git clone https://github.com/Mohanreddy-lab/CivicEd.git
cd CivicEd
npm install
npm run dev
```

## 📄 License

MIT — Built for the PromptWars: Virtual Hackathon by Hack2Skill.
