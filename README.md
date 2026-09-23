
# 🚀 AI CRM — Intelligent Customer Relationship Management Platform

A modern full-stack CRM for managing customers, leads, deals, tasks, analytics, and AI-powered sales intelligence.



  LIVE DEMO = "https://ai-crm-1-azsh.onrender.com"
  GITHUB = "https://github.com/kritik-24/ai-crm"

---

## 📌 Overview

**AI CRM** is a full-stack Customer Relationship Management platform built with the MERN stack and designed to centralize customer data, sales opportunities, follow-ups, tasks, and business analytics in one application.

The platform combines traditional CRM workflows with **AI-powered insights and sales intelligence**, allowing users to manage the complete customer lifecycle from a single dashboard.

The application includes secure authentication, protected REST APIs, MongoDB-based data persistence, customer and lead management, deal pipeline tracking, task management, business analytics, AI-assisted insights, and production deployment on Render.

> **Project Type:** Full-Stack Web Application / CRM / AI-Enhanced Business Application
> **Architecture:** React + REST API + Node.js + MongoDB
> **Deployment:** Render
> **Primary Focus:** CRM workflows, sales pipeline management, analytics, authentication, and AI-assisted insights

---

# 🌐 Live Application

### Frontend

**AI CRM:**
https://ai-crm-1-azsh.onrender.com

### Backend API

**API Server:**
https://ai-crm-z8k9.onrender.com

### Repository

**GitHub:**
https://github.com/kritik-24/ai-crm

---

# ✨ Key Features

## 🔐 Secure Authentication

The application provides a complete authentication workflow:

* User registration
* User login
* JWT-based authentication
* Protected application routes
* Authentication middleware
* Password reset workflow
* OTP-based password recovery
* Transactional email delivery through Brevo API
* Secure password hashing using bcrypt

### Password Recovery Flow

```text
User selects "Forgot Password"
          ↓
Enters registered email
          ↓
Backend validates the user
          ↓
6-digit OTP generated
          ↓
OTP stored temporarily with expiry
          ↓
Brevo Transactional Email API
          ↓
OTP delivered to user's email
          ↓
User verifies OTP
          ↓
Password can be reset
```

---

# 👥 Customer Management

AI CRM provides a centralized customer directory for managing customer relationships.

### Capabilities

* Add new customers
* Store customer name and email
* Store phone information
* Associate customers with companies
* Maintain customer status
* Add customer notes
* Search customers
* Filter customers by status
* Edit customer records
* Delete customer records
* Request AI-powered customer insights

### Customer Lifecycle

```text
Lead
  ↓
Customer
  ↓
Active Relationship
  ↓
Deal / Opportunity
  ↓
Follow-up / Task
```

---

# 🎯 Lead Management

The Leads module is designed to manage potential customers and sales opportunities.

### Features

* Lead management dashboard
* Lead statistics
* Lead search
* Priority filtering
* Lead pipeline
* Company association
* Contact-readiness indicators
* AI-powered lead scoring interface

The lead management workflow helps organize potential customers before they move further into the sales pipeline.

---

# 💼 Deal & Sales Pipeline Management

The Deals module provides a structured sales pipeline for tracking opportunities.

### Deal Stages

| Stage       | Description                        |
| ----------- | ---------------------------------- |
| Prospecting | Initial opportunity                |
| Negotiation | Active discussion or negotiation   |
| Won         | Successfully converted deal        |
| Lost        | Opportunity that was not converted |

### Deal Features

* Create deals
* Track deal value
* Associate deals with customers
* Track sales stages
* Search deals
* Filter by stage
* Edit deals
* Delete deals
* View pipeline statistics
* AI risk analysis
* Calculate pipeline value
* Calculate weighted pipeline
* Calculate expected revenue
* Track win rate

---

# 🤖 AI-Powered CRM Intelligence

The application integrates the **OpenAI API** to provide AI-assisted CRM insights.

AI functionality is designed to add intelligence on top of existing CRM data rather than replacing the core CRM workflow.

### AI-Enabled Areas

* Customer insights
* Lead scoring
* Deal risk analysis
* Sales intelligence
* Business insights

### Example Workflow

```text
CRM Data
   │
   ├── Customer Information
   ├── Lead Information
   ├── Deal Information
   └── Sales Pipeline
            │
            ▼
        AI Analysis
            │
            ▼
      Actionable Insight
```

---

# 📊 Analytics & Sales Intelligence

The Analytics module provides a business-level view of CRM performance.

### Analytics Include

* Total customers
* Active customers
* Total deals
* Pipeline value
* Expected revenue
* Weighted pipeline
* Win rate
* Deal distribution by stage
* Customer health
* Task performance
* High-risk deals
* Won revenue
* Lost revenue

### Sales Intelligence

The application also provides a dedicated sales intelligence section for highlighting key business outcomes.

```text
Sales Intelligence
        │
        ├── Won Revenue
        ├── Lost Revenue
        └── High Risk Deals
```

---

# ✅ Task Management

The Tasks module helps users manage CRM-related work and follow-ups.

### Features

* Create tasks
* Set task title
* Set due date
* Associate task with a customer
* Associate task with a deal
* Set priority
* Set status
* Add task description
* Search tasks
* Filter by status
* Filter by priority
* Track task completion

### Task Workflow

```text
Create Task
     ↓
Assign Customer / Deal
     ↓
Set Priority
     ↓
Set Due Date
     ↓
Track Status
     ↓
Complete Task
```

---

# 📈 Dashboard

The main dashboard provides a high-level overview of CRM performance.

### Dashboard Metrics

* Total leads
* Total customers
* Active customers
* Inactive customers
* Total pipeline
* Expected revenue
* Weighted pipeline
* Win rate
* Pipeline by stage

The dashboard also provides quick actions for:

* Adding customers
* Creating deals
* Refreshing CRM data
* Viewing customers
* Viewing deals

---

# 🖥️ Screenshots

## Dashboard

The dashboard provides a centralized overview of customers, leads, deals, pipeline value, expected revenue, and win rate.

![Dashboard](screenshots/01-dashboard.png)

---

## Customer Management

The customer directory provides customer search, status filtering, editing, AI insights, and deletion functionality.

![Customers](screenshots/02-customers.png)

---

## Lead Management

The Leads module provides lead statistics, search, priority filtering, pipeline tracking, and AI-powered lead intelligence.

![Leads](screenshots/03-leads.png)

---

## Deal Pipeline

The Deals module provides pipeline tracking, deal stages, deal values, search, filtering, editing, deletion, and AI risk analysis.

![Deals](screenshots/04-deals.png)

---

## Task Management

The Tasks module provides task creation, due dates, priorities, statuses, customer/deal associations, and task tracking.

![Tasks](screenshots/05-tasks.png)

---

## Analytics

The Analytics dashboard visualizes customer health, sales pipeline, deal distribution, business health, task performance, and sales intelligence.

![Analytics](screenshots/06-analytics.png)

---

## Authentication

Secure authentication provides the entry point to the CRM application.

![Login](screenshots/07-login.png)

---

## Password Recovery

The password recovery interface allows users to request an OTP through their registered email address.

![Forgot Password](screenshots/08-forgot-password.png)

---

# 🛠️ Technology Stack

## Frontend

| Technology   | Purpose                 |
| ------------ | ----------------------- |
| React 19     | User interface          |
| React Router | Client-side routing     |
| Axios        | API communication       |
| Tailwind CSS | UI styling              |
| Recharts     | Analytics visualization |
| Lucide React | Interface icons         |
| Vite         | Frontend build tooling  |

## Backend

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Node.js    | Runtime environment          |
| Express.js | REST API framework           |
| Mongoose   | MongoDB ODM                  |
| JWT        | Authentication               |
| bcryptjs   | Password hashing             |
| CORS       | Cross-origin API access      |
| dotenv     | Environment configuration    |
| OpenAI API | AI-powered insights          |
| Brevo API  | Transactional email delivery |

## Database

* MongoDB
* Mongoose

## Deployment

* Render
* GitHub

## Development Tools

* Git
* GitHub
* Postman
* VS Code

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │        USER          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React Frontend     │
                         │      Vite            │
                         │  Tailwind / Axios    │
                         └──────────┬───────────┘
                                    │
                               REST API + JWT
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Express.js API     │
                         │      Node.js         │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
             ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
             │   MongoDB    │ │  OpenAI API  │ │  Brevo API   │
             │   Database   │ │ AI Insights   │ │ Email / OTP  │
             └──────────────┘ └──────────────┘ └──────────────┘
```

---

# 🔄 Application Architecture Flow

```text
React UI
   │
   ▼
Axios API Request
   │
   ▼
Express.js REST API
   │
   ▼
Authentication / JWT Middleware
   │
   ▼
Controller Layer
   │
   ▼
Business Logic
   │
   ├──────────────► MongoDB
   │
   ├──────────────► OpenAI API
   │
   └──────────────► Brevo API
   │
   ▼
JSON Response
   │
   ▼
React UI Update
```

---

# 🔌 API Modules

The backend is organized around RESTful API modules.

| Module           | Responsibility                         |
| ---------------- | -------------------------------------- |
| `/api/auth`      | Registration, login, password recovery |
| `/api/customers` | Customer management                    |
| `/api/deals`     | Deal and pipeline management           |
| `/api/tasks`     | Task management                        |
| `/api/ai`        | AI-powered CRM insights                |

The API uses JSON requests and responses and protects authenticated resources using JWT-based authorization.

---

# 🔒 Authentication & Security

Security is an important part of the application architecture.

### Authentication

```text
Registration
    ↓
Password Hashing
    ↓
User Stored in MongoDB
    ↓
Login
    ↓
Credential Validation
    ↓
JWT Token
    ↓
Protected API Requests
```

### Password Security

Passwords are hashed using **bcryptjs** before storage.

### Protected Resources

Authenticated API requests use JWT-based authorization.

### Password Reset

The password reset workflow uses:

* Registered email verification
* Secure OTP generation
* Temporary OTP expiration
* Transactional email delivery
* Password reset flow

---

# 📧 Transactional Email with Brevo

The application uses the **Brevo transactional email API** for password-reset OTP delivery.

The email workflow avoids dependency on traditional SMTP connections in the production deployment.

```text
Forgot Password
       ↓
Generate OTP
       ↓
Store OTP + Expiration
       ↓
Brevo HTTPS API
       ↓
Transactional Email
       ↓
User Receives OTP
```

The Brevo API key and sender configuration are stored as environment variables and are **not committed to GitHub**.

---

# 🧮 Sales Intelligence Calculations

The CRM dashboard exposes several sales metrics.

### Pipeline Value

The total value of deals currently represented in the sales pipeline.

### Weighted Pipeline

Deal value adjusted according to the probability associated with the relevant sales stage.

Conceptually:

```text
Weighted Pipeline
=
Σ (Deal Value × Stage Probability)
```

### Expected Revenue

Revenue forecast derived from deal information and stage probabilities.

### Win Rate

The dashboard provides a win-rate metric based on won and closed deal information available to the application.

---

# 📊 Analytics Visualizations

The analytics module uses **Recharts** to present CRM data visually.

Examples include:

* Customer health distribution
* Pipeline value by stage
* Sales pipeline distribution
* Task performance
* Pipeline performance
* Business health metrics

This transforms raw CRM records into a more readable business-performance view.

---



# 📱 Responsive & Modern UI

The application follows a modern dashboard-oriented design with:

* Sidebar navigation
* Top navigation bar
* Dashboard cards
* Data tables and lists
* Search controls
* Filtering controls
* Status indicators
* Responsive forms
* Sales pipeline cards
* Analytics charts
* AI insight actions
* Clear action buttons
* Consistent visual hierarchy

The UI is designed around a business application workflow rather than a simple CRUD interface.

---

# 🧠 Engineering Highlights

This project demonstrates practical full-stack development concepts including:

## Frontend Engineering

* Component-based React development
* Client-side routing
* API integration
* Form handling
* Protected routes
* Dashboard UI development
* Data visualization
* State-driven UI updates

## Backend Engineering

* REST API design
* Express.js middleware
* Controller-based architecture
* MongoDB data modeling
* Authentication middleware
* JWT authorization
* Password hashing
* Error handling
* External API integrations

## Database

* MongoDB
* Mongoose models
* CRUD operations
* Relationships between CRM entities

## External Services

* OpenAI API
* Brevo transactional email API
* MongoDB
* Render deployment

---


# 🔮 Future Enhancements

Potential future improvements include:

* Role-based access control
* Multi-user teams
* Team member assignment
* Advanced lead scoring
* More sophisticated AI recommendations
* Automated follow-up generation
* Email campaign management
* Customer activity timeline
* Calendar integration
* Real-time notifications
* Advanced sales forecasting
* Custom reports
* Export to CSV/PDF
* Advanced filtering
* Audit logs
* Dark mode
* Mobile-focused UI improvements
* Automated CRM workflows
* Sales activity reminders
* More advanced AI-driven recommendations

---

# 🎯 What This Project Demonstrates

AI CRM demonstrates the ability to build and deploy a complete production-style full-stack application rather than an isolated frontend project.

The project covers:

```text
Frontend Development
        +
REST API Development
        +
Database Design
        +
Authentication
        +
External API Integration
        +
AI Integration
        +
Analytics
        +
Email Automation
        +
Cloud Deployment
```

This makes the project representative of a real-world business application architecture.

---

# 📸 Product Walkthrough

The primary application workflow can be summarized as:

```text
Login
  ↓
Dashboard
  ↓
Customers / Leads
  ↓
Create Deal
  ↓
Track Pipeline
  ↓
Create Follow-up Tasks
  ↓
Review Analytics
  ↓
Use AI Insights
```

---

# 🏆 Project Highlights

* Full-stack MERN CRM application
* Modern React-based dashboard
* RESTful Node.js/Express backend
* MongoDB database integration
* JWT authentication
* Password hashing with bcrypt
* OTP-based password recovery
* Brevo transactional email integration
* OpenAI API integration
* Customer management
* Lead management
* Deal pipeline management
* Task management
* Business analytics
* Sales intelligence
* Deal risk analysis
* Pipeline forecasting
* Recharts-based visualizations
* Production deployment using Render
* Git/GitHub version control

---

# 👨‍💻 Author

## Kritik Pratap Singh

**Full Stack Developer | MERN Stack Developer**

Interested in building scalable web applications, backend systems, AI-integrated products, and data-driven software solutions.

### Connect

* GitHub: https://github.com/kritik-24

---

# ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is developed for learning, portfolio, and demonstration purposes.

---


