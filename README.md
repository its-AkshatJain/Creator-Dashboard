# CreatorDash

CreatorDash is a web-based application that pulls **public data** from the **Reddit** and **Twitter APIs** to provide insights and analytics for creators. Users can fetch and view posts and trends without needing to log in or authenticate with either platform.

## Features

- Fetch Reddit data (subreddits, posts, comments, and user info)
- Fetch Twitter data (tweets, followers, user profiles)
- Visualize fetched data for insights
- Deployed frontend and backend
- No user login required (uses app-level access to public APIs)

## Live Demo

Access the deployed application here:  
[https://creator-dashboard-2476e.web.app](https://creator-dashboard-2476e.web.app)

---

## Project Structure

```
creatordash/
├── client/                 # React frontend
│   ├── .env                # Environment variables for client
│   ├── public/             # Static assets
│   ├── src/                # Components, pages, utilities
│   └── package.json        # Frontend dependencies
├── server/                 # Express backend
│   ├── .env                # Environment variables for server
│   ├── controllers/        # API business logic
│   ├── routes/             # Route handlers for Reddit and Twitter
│   ├── models/             # Database models
│   └── server.js           # Entry point
└── README.md               # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- Git
- Reddit and Twitter API credentials

---

## Client Setup

```bash
git clone https://github.com/yourusername/creatordash.git
cd creatordash/client
```

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file in the `client/` directory:

```
VITE_SERVER_URL=https://creator-dashboard-1.onrender.com
REDDIT_REDIRECT_URI=https://creator-dashboard-2476e.web.app
```

### 3. Start the client

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

---

## Server Setup

```bash
cd creatordash/server
```

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file in the `server/` directory:

```
# Server Configuration
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority

# CORS Configuration
CLIENT_URL=http://localhost:5173

# Reddit API Credentials
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_REDIRECT_URI=https://your-frontend-url.web.app
REDDIT_USER_AGENT=your_app_name/1.0

# Twitter API Credentials
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET_KEY=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

### 3. Start the server

```bash
npm start
```

Server will run at `http://localhost:5000`.

---

## Deployment

### Deploying Backend to Render

1. Go to [https://render.com](https://render.com) and create a new Web Service.
2. Connect your GitHub repository.
3. Set the **Build Command**:
   ```bash
   npm install
   ```
4. Set the **Start Command**:
   ```bash
   npm start
   ```
5. Add environment variables from your `.env` file in the Render dashboard.
6. Click **Deploy**.

Example deployed backend:  
`https://creator-dashboard-1.onrender.com`

---

### Deploying Frontend to Firebase

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in and initialize:
   ```bash
   firebase login
   firebase init
   ```
3. Select "Hosting", choose your Firebase project, and set the build folder to `dist/`.
4. Build the frontend:
   ```bash
   npm run build
   ```
5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

Example deployed frontend:  
`https://creator-dashboard-2476e.web.app`

---

## Contributing

1. Fork the repository.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/creatordash.git
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
4. Make changes and commit:
   ```bash
   git commit -m "Add feature or fix"
   ```
5. Push and create a pull request:
   ```bash
   git push origin feature-name
   ```

---

## Troubleshooting

- **Missing API Keys**: Confirm all environment variables are correctly configured.
- **CORS Issues**: Ensure the `CLIENT_URL` is correctly set and matches the frontend origin.
- **Deployment Failures**: Double-check build and start commands and ensure the `.env` is correctly configured on the deployment platforms.
- **API Errors**: Verify that your Reddit and Twitter API credentials are valid and active.
