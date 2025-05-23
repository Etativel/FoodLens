# FoodLens

![FoodLens Icon](./public/FoodLens_icon.png)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)  
[![Node.js ≥16.0.0](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)  
[![Python ≥3.8](https://img.shields.io/badge/python-%3E%3D3.8-blue.svg)](https://www.python.org/)

## Overview

FoodLens helps you scan any food to instantly get nutrition facts, track calories, and manage your diet with ease. Use your camera to scan food labels or ingredients and instantly log calories, macros, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Roadmap](#development-roadmap)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Features

- **Food Scanner**: Use your camera to scan labels or ingredients.
- **Nutrition Tracker**: Instant breakdown of calories, macros, vitamins, and minerals.
- **Calorie Counter**: Log daily intake, set goals, and view progress charts.
- **Diet Management**: Save scan history, review past meals, and export logs.
- **Recipe Search**: Browse and fetch recipes based on ingredients.
- **Premium & Credit System**: Enhanced AI scanning for premium users with credit-based access.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Query, Chart.js, Recharts
- **Backend (Express)**: Node.js, Express 5, Prisma ORM, Passport (JWT & Google OAuth), Cloudinary, OpenAI SDK
- **Backend (Python)**: Flask, PyTorch, Transformers, Pillow, Waitress/Gunicorn, PyJWT
- **Database**: PostgreSQL (via Prisma Client)
- **Utilities**: Multer, CORS, Rate Limiter, Nodemailer, dotenv

## Getting Started

### Prerequisites

- Node.js ≥ 16.0.0
- Python ≥ 3.8
- PostgreSQL
- Cloudinary account
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YourUsername/FoodLens.git
   cd FoodLens

   ```

2. **Setup Express Backend**

   ```bash
    cd backend/express
    npm install
    cp .env.example .env
    # Configure .env: DATABASE_URL, JWT_SECRET, SESSION_SECRET,
    # CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, OPENAI_API_KEY
    npx prisma migrate dev --name init
    npm start

   ```

3. **Setup Python Backend**

   ```bash
    cd ../../backend/python
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cp .env.example .env
    # Configure .env: OPENAI_API_KEY, PYTHON_BACKEND_PORT

    # Run with Waitress:
    waitress-serve --listen=*:5000 app:app

    # Or with Gunicorn:
    gunicorn app:app --workers 4 --bind 0.0.0.0:5000

   ```

4. **Setup Frontend**
   ```bash
    cd ../../frontend
    npm install
    cp .env.example .env
    # Configure .env: VITE_API_URL, VITE_PYTHON_API_URL
    npm run dev
   ```

### Environment Configuration

**Express Backend (backend/express/.env):**

- `PORT`: API server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for cookie signing
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

**Python Backend (backend/python/.env):**

- `PORT`: API server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for cookie signing
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

## Development Roadmap

- **May 1–5: Project Kickoff & MVP**

  - Flask API setup for image prediction & pre-trained model
  - Express backend & Vite/React frontend initialization
  - Camera upload, OpenAI vision scan, skeleton component

- **May 6–12: Core Integration & Feature Build-out**

  - Configure Multer + Cloudinary for image storage; proxy JWT cookie to Flask
  - Add recipe endpoints (fetch/upsert) and nutrition field support
  - Build scan storage, intake logs, recipe pages, and calories line chart
  - Introduce scan history view, filtering, and nutrient graphs

- **May 13–19: Authentication, Profiles & UI Components**

  - Add JWT auth, Google OAuth, email verification (nodemailer + verif code table)
  - Implement LoginCode table and password validation
  - Develop user profile provider and settings page
  - Show daily intake chart on home; refine food-card layout and mobile toggles

- **May 20–22: Security, Error Handling & UX Enhancements**

  - Guard sign-in/UI with token checks; rate limiter for token requests
  - Build reset-password flow: token table, request/reset pages, email template
  - Add 404 page, loading spinners, tooltips for credits, and minor layout tweaks
  - Implement cache invalidation for reducing credits

- **May 23: Final Polish & Cleanup**
  - Minor styling refinements across components

## Contributing

Feel free to submit a Pull Request.

1. Fork the repository
2. Create a branch: git checkout -b feature/my-feature
3. Commit your changes: git commit -m 'Add some feature'
4. Push to your branch: git push origin feature/my-feature
5. Open a Pull Request

### Contact Information

- Maintainer: Farhan
- Email: farhanmaulana.dev@gmail.com
- GitHub: github.com/YourUsername/FoodLens

## License

[MIT](https://github.com/Etativel/Nodes-Blog/blob/main/LICENSE)
