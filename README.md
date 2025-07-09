# CodeReview SaaS

**CodeReview** is a modern SaaS platform for automated code review, code quality analytics, and team collaboration.  
It integrates seamlessly with GitHub, providing instant feedback on every pull request to help teams ship better code, faster.

---

## 🚀 Features

- **Automated Code Review:**  
  AI-powered static analysis to catch bugs, logic errors, and code quality issues before they reach production.
- **Security Scanning:**  
  Detect vulnerabilities and unsafe patterns with comprehensive security analysis.
- **Performance Optimization:**  
  Identify bottlenecks and optimization opportunities in your codebase.
- **GitHub Integration:**  
  OAuth-based authentication and real-time analysis of pull requests and repositories (public & private).
- **Smart Notifications:**  
  Get alerts via Slack, email, or webhook with customizable thresholds.
- **Analytics & Insights:**  
  Track code quality trends, team performance, and technical debt.
- **Custom Rules:**  
  Pro/Enterprise plans support custom linting rules and coding standards.
- **Team Collaboration:**  
  Assign reviews, discuss code, and monitor team-wide metrics.
- **Historical Analysis:**  
  Visualize improvements and patterns over time.

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React
- **State/Data:** React Query, React Router
- **Backend:** Supabase (Auth, Database, Edge Functions)
- **Integrations:** GitHub OAuth, Stripe (for billing)
- **Other:** Modern, modular component structure, full TypeScript support

---

## 📦 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/code-review-saas.git
   cd code-review-saas
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in your Supabase and Stripe keys.

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## ⚡️ Authentication & Permissions

- **GitHub OAuth only:**  
  Users sign in with GitHub.
  > To access private repositories and PRs, ensure your Supabase GitHub provider requests the `repo` scope.

---

## 💳 Pricing & Plans

- **Free:** Up to 3 repositories, basic checks, community support
- **Pro:** Unlimited repos, advanced scanning, custom rules, team tools, analytics
- **Enterprise:** SSO, custom integrations, on-premise, dedicated support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋‍♂️ Contact

For questions, feedback, or support, please open an issue or contact the maintainer.
