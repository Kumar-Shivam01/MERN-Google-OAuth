<div align="center">

# ✳ One — MERN Google OAuth

**One account. A simpler start.**

Google sign-in, persistent user profiles, and a clean, responsive dashboard.

![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-303030?style=flat-square&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47a248?style=flat-square&logo=mongodb&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google-OAuth_2.0-4285f4?style=flat-square&logo=google&logoColor=white)

[Architecture](#architecture) · [Setup](#getting-started) · [Structure](#folder-structure)

</div>

## About

A full-stack MERN project that signs users in with Google, finds or creates their MongoDB profile, and issues an application JWT. The frontend saves the returned session data and displays the user's name, email, and profile image.

- Google OAuth authorization-code popup flow
- Automatic account creation for first-time users
- Profile dashboard with local session persistence and sign-out
- Responsive interface with loading states, inline errors, and a 404 page

## Tech stack

| Frontend | Backend | Database & authentication |
| --- | --- | --- |
| React 19, Vite 8 | Node.js, Express 5 | MongoDB, Mongoose |
| React Router, Axios, CSS | Google APIs, dotenv, CORS | Google OAuth 2.0, JSON Web Tokens |

## Architecture

```mermaid
flowchart LR
    Visitor(["User"])
    subgraph Browser["Browser · localhost:5173"]
        UI["React + Vite<br/>Login / Dashboard"]
        SDK["Google Identity Services<br/>useGoogleLogin"]
        HTTP["Axios client<br/>src/api.js"]
        Store[("localStorage<br/>user-info")]
        Guard["RefreshHandler<br/>Client-side route gate"]
    end
    subgraph Server["Node.js + Express · localhost:3001"]
        Route["GET /auth/google"]
        Controller["googleLogin controller"]
        OAuth["Google OAuth2 client"]
        JWT["jsonwebtoken<br/>Application JWT"]
    end
    Google["Google OAuth + UserInfo"]
    DB[("MongoDB<br/>User documents")]

    Visitor -->|"Continue with Google"| UI
    UI --> SDK
    SDK <-->|"Popup / authorization code"| Google
    SDK -->|"code"| HTTP
    HTTP -->|"GET /auth/google?code=..."| Route
    Route --> Controller
    Controller --> OAuth
    OAuth <-->|"Code exchange / Google tokens"| Google
    Controller <-->|"Access token / profile"| Google
    Controller <-->|"Find or create user"| DB
    Controller --> JWT
    JWT -->|"JWT + user response"| HTTP
    HTTP -->|"Persist profile + app token"| Store
    Store --> Guard
    Guard -->|"Navigate to dashboard"| UI

    classDef frontend fill:#edf3e8,stroke:#6d8c60,color:#203b2e
    classDef backend fill:#eaf0fa,stroke:#6a85b2,color:#243a5a
    classDef external fill:#fff4df,stroke:#c69d52,color:#5c4520
    classDef storage fill:#f1eafa,stroke:#9a7eb5,color:#48305c
    class UI,SDK,HTTP,Guard frontend
    class Route,Controller,OAuth,JWT backend
    class Google,Visitor external
    class DB,Store storage
```

**[Open the interactive architecture →][architecture-live]**

Explore a preloaded diagram in Mermaid Live with pan, zoom, and editing. The diagram above renders directly on GitHub.

### How it works

1. The user selects **Continue with Google** and completes the popup flow.
2. React sends the authorization code to `GET /auth/google`.
3. Express exchanges the code for Google tokens and fetches the user's profile.
4. MongoDB returns the existing user or saves a new profile.
5. Express returns the user and an application JWT.
6. React stores the session in `localStorage` and opens the dashboard. Signing out clears that stored session.

> The dashboard currently checks for a stored token, not its validity or expiry. Server-side JWT verification for private endpoints is not implemented.

## Getting started

### Prerequisites

- Node.js **22.12+** and npm
- MongoDB running locally or an Atlas connection string
- A Google Cloud **Web application** OAuth client

### 1. Clone and install

```bash
git clone https://github.com/Kumar-Shivam01/MERN-Google-OAuth.git
cd MERN-Google-OAuth
npm ci --prefix server
npm ci --prefix client
```

### 2. Configure Google and the backend

In [Google Cloud Console](https://console.cloud.google.com/), configure the OAuth consent settings and add `http://localhost:5173` as an **Authorized JavaScript origin**. Add your account as a test user if required.

Copy [server/.env.example](server/.env.example) to `server/.env` and fill in:

```dotenv
PORT=3001
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
DB_URL=mongodb://127.0.0.1:27017/mern_google_oauth
JWT_SECRET=replace-with-a-long-random-secret
JWT_TIMEOUT=7d
```

Set the **same client ID** on `GoogleOAuthProvider` in [client/src/App.jsx](client/src/App.jsx). Keep secrets in the backend's ignored `.env` file.

The implementation uses a popup callback; the server OAuth client is configured with `postmessage`, not a separate Express callback route.

### 3. Run the app

**Terminal 1 — backend**

```bash
cd server
npm start
```

**Terminal 2 — frontend, starting from the repository root**

```bash
cd client
npm run dev -- --port 5173 --strictPort
```

Open **[localhost:5173](http://localhost:5173)**. Confirm the backend reports a successful MongoDB connection before signing in.

The frontend API URL is `http://localhost:3001/auth` in [client/src/api.js](client/src/api.js). Update it if you change the backend port.

## Folder structure

```text
MERN-Google-OAuth/
├── client/
│   ├── public/                 # Favicon and static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppShell.jsx    # Shared page layout
│   │   │   ├── GoogleLogin.jsx # Sign-in and session storage
│   │   │   ├── Dashboard.jsx   # Profile and sign-out
│   │   │   ├── RefreshHandler.jsx # Stored-token redirects
│   │   │   └── PageNotFound.jsx
│   │   ├── api.js              # Axios API client
│   │   ├── App.jsx             # Routes and auth state
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── vite.config.js
├── server/
│   ├── controllers/googleLogin.js # OAuth exchange and JWT issuance
│   ├── models/userModel.js     # User schema
│   ├── routes/authRouter.js    # Authentication routes
│   ├── utils/googleConfig.js   # Google OAuth client
│   ├── .env.example
│   └── server.js               # Express and MongoDB setup
└── README.md
```

## API & commands

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/auth/test` | Check that the API is reachable |
| GET | `/auth/google?code=...` | Sign in; returns `{ message, token, user }` |

Run `npm run build` or `npm run lint` inside `client/` to build or check the frontend.

**Login trouble?** Check the inline error and the `/auth/google` network response. A popup `window.closed` COOP warning alone does not confirm a failed login; the development popup policy is already configured in Vite.

[architecture-live]: https://mermaid.live/edit#pako:eNqFVNtu2zgQ_ZUB89LCiu3YcZoa2S7iqtu6abtBEneBtfpAkyOJicwRSKrJbtPv6vt-WUFSvrbF6onEnHNm5sxQX5ggiWzM8oruRcmNg3dXmQYA-KiscmSezDM2s2gy9ulpDNhmURhelzAxdG_RzDPWnuC_b1CR4FVJ1o1HR8-GGfsUSf6bTecZu0IuHHTgo3J4tjC9F--oUBp6kHJbLogbucO5Ti_mGXtNVFQIU4naKfcPXKP5rATaINBYjPGgtMN-c3NzOc_Y-YMiC6JSqF2gWCN6vFbdW7ubzJHB-ZOMhSb8jRe4ymEOlc4pY0-3CK8bbmRoKjdoyzdcywpNYLwM2Q6tkgiGGodQcIfrdKjlnpu-p2DmB5LYvbXQgVcPtUFrd20d9vtHO1VfeXVv0qsb6PHGlb0i2LEDeknaGaqqkKHY2AViHdjB_3neuHLjfLgOWgt3gG__upln7NaSvseFozvUof3zuq6U4E6R9pAf-47CexmgA37XpsHolpFO_ETeky4onQRtDwFJolmidjZOZGdn4fDwxWPGfM9KNwj3ypVtwow9wmwa0bOpB_oVi_fr9ALOIvWS6qaGHng7yah_YyP-rXiBVmpNipxV1C9djPlTG9wfzu8e_Vu32_WMMMFICcdQ1mZiMbK5h3DwK0aidWerpiUCPoiS6wKh19YKYTJ2v_gtzZZ-LoTfuACHHtSGclXh__P-UFoCGRAGuUNowh_jEdLJT4v3G6Hb7WkN8qdO4IFBW5O2vzbzEo1V1q2qgw7wuo41e054xu10_DGkDE-1XT1_bKU-8M_KP0xwBHLzB4pLEuGi4tammENuSDvUEnJVVeMDlPkQTxPrDN3h-OBEnoqTfiKoIjM-GPSHiwHuCSy4uNvi87yf8w2fn44WgzX_eMhHfI-PDw6N5lUrkOf5sczXAuLkuRytBUbieDTo7wnY-Etb8Y-QbxXwnD_DxWjFPz4d9kdiiw-zaXKdXiR-Dkm0cGXINioscLKZdxK2M_HjbdvfRselSlbvdtXgNiSdJHGKbfEsYUs0S64kG7MvGXMlLjFj44xJbu4y9pUlrKkld5gqXhi-ZGNnGkyYoaYo2TjnlcWE1Vz_TdQGv34HTo1HOg
