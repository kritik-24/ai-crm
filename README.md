# 🚀 AI-Powered CRM

A full-stack Customer Relationship Management (CRM) application built using the **MERN stack**. The application helps businesses manage customers, leads, deals, and tasks while providing analytics, sales intelligence, and AI-powered insights.

The project implements secure authentication, RESTful APIs, database management, CRM workflows, and modern full-stack development practices.

---

## 🔗 Live Demo

🌐 Live Frontend: https://ai-crm-1-azsh.onrender.com

⚙️ Backend API: https://ai-crm-z8k9.onrender.com

📂 GitHub Repository: https://github.com/kritik-24/ai-crm

---

# 📌 Project Overview

AI-Powered CRM is designed to provide a centralized platform for managing important sales and customer-related activities.

Users can manage:

- Customers
- Sales leads
- Deals
- Tasks
- Sales activities

The application also provides analytics and sales intelligence features to help users understand customer and deal-related information.

The backend follows a REST API architecture and uses JWT-based authentication to secure protected resources.

---

# ✨ Features

## 🔐 Authentication

- User registration and login
- JWT-based authentication
- Protected routes
- Password reset functionality with OTP workflow

---

## 👥 Customer Management

- Create and manage customer records
- Centralized customer information
- Manage customer-related CRM data

---

## 🎯 Lead Management

- Create and manage sales leads
- Track lead information throughout the sales process
- Organize potential customers and sales opportunities

---

## 💼 Deal Management

- Create and manage deals
- Track deal value
- Associate deals with customer information
- Manage different deal statuses

### Deal Statuses

- Prospecting
- Negotiation
- Won
- Lost

---

## ✅ Task Management

- Create and manage CRM-related tasks
- Organize sales and customer activities
- Track important tasks within the CRM workflow

---

## 📊 Analytics

The application provides analytics related to:

- Customer statistics
- Deal statistics
- Sales analytics

---

## 📈 Sales Intelligence

- Sales forecasting
- Rule-based high-risk deal detection
- Sales-related insights

---

## 🤖 AI Integration

The application integrates with the **OpenAI API** to provide AI-powered CRM insights.

AI functionality helps enhance CRM workflows and provide additional insights based on application data.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3
- Axios

## Backend

- Node.js
- Express.js
- REST APIs

## Database

- MongoDB
- Mongoose

## Authentication

- JSON Web Tokens (JWT)

## AI Integration

- OpenAI API

## Deployment

- Render

## Other Tools

- Git
- GitHub
- Postman
- Nodemailer

---

# 🏗️ System Architecture

```text
                    ┌───────────────┐
                    │     USER      │
                    └───────┬───────┘
                            │
                            ▼
              ┌────────────────────────┐
              │     React Frontend     │
              │       CRM UI           │
              └───────────┬────────────┘
                          │
                    REST API / JWT
                          │
                          ▼
              ┌────────────────────────┐
              │    Express.js Server   │
              │       Node.js          │
              └───────────┬────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
                ▼                   ▼
        ┌──────────────┐    ┌──────────────┐
        │   MongoDB    │    │  OpenAI API  │
        │              │    │ AI Insights  │
        └──────────────┘    └──────────────┘
```

---

# 🔄 Application Flow

```text
React Frontend
      │
      ▼
Axios / API Requests
      │
      ▼
Express.js REST API
      │
      ▼
Authentication Middleware (JWT)
      │
      ▼
Controllers & Business Logic
      │
      ▼
MongoDB / Mongoose
      │
      ▼
Response → Frontend
```

---

# 📁 Project Structure

```text
AI-CRM/
│
├── client/
│   │
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── App.jsx
│
├── server/
│   │
│   ├── controllers/
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Customer.js
│   │   ├── Lead.js
│   │   ├── Deal.js
│   │   └── Task.js
│   │
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```





# 🔌 API Modules

| Module | Functionality |
|---|---|
| Authentication | Registration, login, JWT authentication, password reset |
| Customers | Create and manage customer records |
| Leads | Create and track sales leads |
| Deals | Manage deals and sales pipeline |
| Tasks | Create and manage CRM tasks |
| Analytics | Customer, deal, and sales analytics |
| Sales Intelligence | Sales forecasting and high-risk deal detection |
| AI Insights | AI-powered CRM insights |

---

# 🔒 Authentication Flow

```text
User Login
    │
    ▼
Server Validates Credentials
    │
    ▼
JWT Token Generated
    │
    ▼
Token Sent to Client
    │
    ▼
Client Sends Token with Protected Requests
    │
    ▼
JWT Middleware Validates Token
    │
    ▼
Access Granted to Protected Resources
```

---




# 🌟 Project Highlights

- Built a full-stack CRM application using the MERN stack.
- Implemented secure JWT-based authentication and protected routes.
- Developed customer, lead, deal, and task management modules.
- Designed RESTful APIs using Node.js and Express.js.
- Integrated MongoDB with Mongoose for database operations.
- Implemented password reset functionality with an OTP workflow.
- Added analytics for customer, deal, and sales-related information.
- Implemented sales intelligence features such as forecasting and high-risk deal detection.
- Integrated the OpenAI API for AI-powered CRM insights.
- Built the client-side interface using React.
- Used API requests for communication between frontend and backend.
- Deployed both frontend and backend using Render.

---

# 🚀 Deployment

The application is deployed using **Render**.

🌐 Live Frontend: https://ai-crm-1-azsh.onrender.com

⚙️ Backend API: https://ai-crm-z8k9.onrender.com

The deployment includes:

- React frontend deployment
- Node.js and Express backend deployment
- Environment variable configuration
- MongoDB database connectivity
- Integration between the deployed frontend and backend APIs

---

# 🧪 Testing APIs

API endpoints can be tested using:

- Postman

Example workflow:

```text
Register User
     ↓
Login User
     ↓
Receive JWT Token
     ↓
Send JWT Token with Protected Requests
     ↓
Access CRM Resources
```

---

# 🔮 Future Improvements

Possible future improvements include:

- Improved CRM dashboard visualizations
- Advanced analytics
- Enhanced sales forecasting
- Improved AI-powered insights
- Role-based access control
- Team collaboration features
- Notification system
- Activity tracking
- Improved reporting features
- Automated follow-up workflows

---

# 👨‍💻 Author

**Kritik Pratap Singh**

Full Stack Developer | MERN Stack Developer

GitHub: https://github.com/kritik-24

---

# 📄 License

This project is developed for learning and portfolio purposes.
