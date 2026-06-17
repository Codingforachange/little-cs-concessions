# Little C's Concessions - Full-Stack Web Application

A professional-grade, fully responsive web application built to streamline operations for a Veteran Owned & Operated mobile food business. This platform provides customers with a live tracking schedule and grants business administrators complete control over operations via a secure mobile-optimized management dashboard.

## 🔗 Live Application
* **Frontend Production URL:** [https://little-cs-concessions.netlify.app](https://little-cs-concessions.netlify.app)

---

## 🛠️ The Tech Stack

### Frontend (`LittleCsFrontEnd`)
* **Framework:** Angular (v17+) SPA Architecture
* **Styling & Responsive UI:** Bootstrap 5 & Material Icons
* **Hosting & Deployment:** Netlify (CI/CD Pipeline via GitHub)

### Backend (`LittleCsBackEnd`)
* **Environment:** Python Full-Stack REST API
* **Database Engine:** PostgreSQL Relational Database
* **Hosting Engine:** Render (Cloud Data Persistence)

---

## 💡 Key Architectural Features

### 1. Dynamic Location Tracker & Event Scheduler
* Pulls up-to-the-minute scheduling data directly from the cloud database to show hungry clients precisely where the trailer is operating next.
* Implements client-side smooth anchor routing for a seamless user experience.

### 2. Mobile-First Secure Admin Portal
* A password-protected dashboard allowing business owners to securely log in directly from their smartphones on-site at the food trailer.
* Provides a complete interface to add new events, update map coordinates, edit service times, and wipe out canceled dates.

### 3. Review Moderation Layer
* Features a custom user feedback engine where public-facing reviews are held in a pending queue.
* Administrators have multi-action capabilities to verify, approve, or permanently purge incoming reviews to keep the brand safe from spam.

### 4. Custom Single Page Application (SPA) Routing & SEO
* Engineered custom server-side routing rule configurations (`_redirects`) mapped through the Angular compiler asset pipelines.
* This explicitly resolves common production single-page refresh constraints (404 errors) on static content delivery networks.

---

## 🚀 Local Development Setup

To run this repository locally on your computer:

1. Clone the master repository:
   ```bash
   git clone [https://github.com/Codingforchange/little-cs-concessions.git](https://github.com/Codingforchange/little-cs-concessions.git)
