# Veritas AI - Real-Time Truth Verification

Veritas AI is a professional platform designed to combat misinformation and fake news using advanced Natural Language Processing. It provides users with instant, evidence-based verdicts on news content, articles, and social media narratives.

## 🚀 Key Features

- **Multi-Source Analysis**: Analyze plain text, news URLs, or social media handles for factual accuracy.
- **Social Discovery Feed**: Real-time scanning of trending narratives across platforms like X (Twitter), Facebook, and Reddit.
- **Bulk Verification**: Verify multiple links or claims simultaneously with high-efficiency batch processing.
- **Evidence Summaries**: Get concise, bulleted explanations of why content is flagged as Real, Fake, or Suspicious.
- **Trust Analytics**: Personal and global metrics tracking reliably checked sources and flagging accuracy.
- **Identity Verification**: Secure authentication to track your history and build your trust score.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend / Database**: Firebase Firestore & Authentication
- **AI Engine**: Advanced Large Language Models for linguistic and contextual patterns
- **Data Visualization**: Recharts for live trend analysis

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd veritas-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```
   *Note: Ensure your Firebase configuration is properly set up in the `firebase-applet-config.json` equivalent if running locally.*

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛡️ Security

Veritas AI implements strict Firestore security rules to protect user data and ensure the integrity of trust scores. Authentication is required for historical tracking and trust metric accumulation.

## 📊 Analytics

The platform monitors global misinformation trends, providing insights into the distribution of real vs. fake news patterns on a weekly basis.
