# CreatorDash

CreatorDash is a web-based application that pulls data from the Reddit and Twitter APIs to provide valuable insights and analytics for creators and users. This project allows you to fetch, visualize, and interact with data from these platforms, making it easier to track user engagement, posts, and more.

## Features
- Fetch Reddit data (posts, comments, and user profiles)
- Fetch Twitter data (tweets, followers, etc.)
- Visualize the data for insights
- Easy integration with your own Reddit and Twitter accounts

## Demo
You can access a demo of the application [here](https://creator-dashboard-2476e.web.app).

---

## Getting Started

This project has two parts: **Client** and **Server**, each with its own environment variables. Below is the setup for both.

### Prerequisites

Before setting up the project, ensure that you have the following:

- **Node.js** and **npm**: You'll need Node.js installed to run both the client and server.
- **Git**: For version control and cloning the repository.
- **Reddit API credentials**: You will need to register your application with Reddit and get the `CLIENT_ID`, `CLIENT_SECRET`, and `REDIRECT_URI`.
- **Twitter API credentials**: Similarly, you'll need Twitter API credentials (these will be used for Twitter data fetching).

---

### Folder Structure

The project is divided into **Client** and **Server** folders. Here is the structure:

```
creatordash/
├── client/                 # Client code (React-based)
│   ├── .env                # Environment variables for the client
│   ├── public/             # Static assets (images, etc.)
│   ├── src/                # React components, utils, and pages
│   ├── package.json        # Client dependencies
│   └── README.md           # Client setup and instructions
├── server/                 # Server code (Node.js and Express)
│   ├── .env                # Environment variables for the server
|   ├── data/
│   ├── controllers/        # Controllers for handling API requests
│   ├── routes/             # API routes (Reddit & Twitter API logic)
│   ├── models/             # MongoDB models (if any)
│   ├── server.js           # Main entry point for the server
│   ├── package.json        # Server dependencies
│   └── README.md           # Server setup and instructions
└── README.md               # This file (Project-wide overview)
```

---

### Client Setup

#### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/creatordash.git
cd creatordash/client
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Create the `.env` file for the client:
In the **client** directory, create a `.env` file and add the following:

```env
# Client environment variables
VITE_SERVER_URL=https://creator-dashboard-1.onrender.com
REDDIT_REDIRECT_URI=https://creator-dashboard-2476e.web.app
```

#### 4. Run the client:
To start the client in development mode, run:

```bash
npm run dev
```

This will launch the client locally, and you can access it by visiting `http://localhost:3000`.

---

### Server Setup

#### 1. Clone the repository (if not already done):
```bash
git clone https://github.com/yourusername/creatordash.git
cd creatordash/server
```

#### 2. Install dependencies:
```bash
npm install
```

#### 3. Create the `.env` file for the server:
In the **server** directory, create a `.env` file and add the following:

```env
# Server environment variables
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://your_mongo_connection_string

# Client URL for CORS
CLIENT_URL=http://localhost:5173
REDDIT_CLIENT_ID=gTPMyZY_mdlyhY91AsNGwQ
REDDIT_CLIENT_SECRET=oEQC9B3wYG_CBgrK66nx6BjHPRelnQ
REDDIT_REDIRECT_URI=https://creator-dashboard-2476e.web.app
REDDIT_USER_AGENT=CreatorDash/1.0

TWITTER_API_KEY=sfzV0jkkHYdJ0JLl32a46UIgj
TWITTER_API_SECRET_KEY=rYeg5Ggi7iQdU8EXEhLxyRYM1i8cM2o1Z5xxR1g97rqTu8PifE
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAAAy80wEAAAAAqLDpWgGOskElAbxTRQRiJ5H%2FymM%3D0RYfd3wsyc4geTGXWpaZeY1JtJgdmm0YstClCUxgaedRQeAjvE
```

#### 4. Run the server:
To start the server locally, run:

```bash
npm start
```

This will start the server on port `5000` (default), and you can access the API at `http://localhost:5000`.

---

## Contributing

We welcome contributions to the project! To contribute, please follow these steps:

1. Fork the repository.
2. Clone your fork locally:
    ```bash
    git clone https://github.com/yourusername/creatordash.git
    ```
3. Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feature-name
    ```
4. Make your changes and commit them:
    ```bash
    git commit -m "Description of your changes"
    ```
5. Push to your forked repository:
    ```bash
    git push origin feature-name
    ```
6. Submit a pull request to the main repository.



### Troubleshooting

If you run into any issues while setting up or using the app, check the following:

1. **Missing API Keys**: Ensure that all necessary API keys and environment variables are added in the `.env` files.
2. **CORS Issues**: If you encounter CORS issues, make sure that your `CLIENT_URL` in the server matches the client’s URL, and ensure CORS is properly configured on the server.
3. **OAuth Errors**: Double-check the `REDIRECT_URI` values for both Reddit and Twitter. They need to match exactly what’s registered in the developer portals.
