# 🤝 Contributing to NeuroSync

Thanks for your interest in contributing to **NeuroSync** — your energy helps us build emotionally aware, productivity-enhancing software for the future of work.

Please follow these guidelines to ensure a smooth contribution process.

---

## 📦 Project Overview

NeuroSync is a modular productivity OS that includes:

- **FlowForge™** — Smart task + calendar planner
- **PulseSync™** — Emotional health and mood insights
- **EchoTwin™** — Tonal matching communication assistant
- **Focus Bubble™** — Distraction-free mode during peak hours
- **MoodMorph™** — Emotionally aware interface that adapts to your state
- **NeuroBoard™** — Team mood visualization and burnout prevention

---

## 🧪 Local Setup

```bash
# Clone the repo
git clone https://github.com/your-org/neurosync.git
cd neurosync

# Start the dev environment
docker-compose up --build

black .
ruff check .
pytest

npm run lint
npm run test

feature/<feature-name>
bugfix/<bug-description>
docs/<what-you-updated>
refactor/<area>

✅ Pull Request Checklist
 PR title follows naming convention

 Code is formatted and linted

 Tests added for all new functionality

 GitHub Actions CI passes

 If adding a feature: update the relevant module README if needed

 Add yourself to the CONTRIBUTORS section (if applicable)

🧠 Feature Suggestions
Want to pitch a new module or enhancement?
Open a GitHub issue using the Feature Proposal template or email us at product@neurosync.ai.

👥 Community & Support
Website: neurosync.ai

Email: hello@neurosync.ai

Twitter: @neurosync_os

We’re excited to build the future of emotional productivity with you.


