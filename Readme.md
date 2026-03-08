# SSHProxy ( Browser based SSH Terminal)

SSHProxy is a full-stack application for managing remote machines and opening browser-based SSH terminal sessions.

The purpose of this project is to provide a secure and simple way to authenticate users, manage machine records, and connect to remote systems from a web interface.


# Security 
-  AES-256-GCM encryption for all sensitive data — provides both confidentiality and tamper detection via auth tags

-  Unique IV + salt per entry generated using crypto.randomBytes() (CSPRNG) — identical plaintexts never produce identical ciphertexts

-  PBKDF2-SHA256 with 100,000 iterations for key derivation — brute-force resistant; keys are never hardcoded or stored

-  Raw private keys never touch the database — exist in memory only during encryption, discarded immediately after

-  Decryption fails fast — GCM auth tag verification rejects any tampered ciphertext before plaintext is returned

&nbsp;

# Tech stack
## Frontend
- NexT.js ( Typescript )
- Clerk ( Auth provider)
- xterm.js ( for Terminal )

## Backend
- Node.js ( Typescript )
- Websocket 
- SSH-2 npm package ( for ssh connection , backend to Remote machine )
- PostgreSQL
- Prisma
- Redis ( for session management )

&nbsp;

# Deployement 

### Frontend on vercel - https://sshproxy.in
### Backend on EC2 ( Node server , PostgreSQL database , Redis )

&nbsp;

# Project Structure

- `client/` - Next.js frontend application.
- `server/` - Node.js/TypeScript backend API, WebSocket terminal service, and Prisma database layer.

&nbsp;


# Clone the Repository

```bash
git clone https://github.com/Rashid-123/SSHProxy
cd SSHProxy
```

# Installation

### Server Setup

```bash
cd server
npm install
```

Optional development steps:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Client Setup

```bash
cd client
npm install
```
# Enviornment variables

### Server side ( .env ) 


```bash
DATABASE_URL=
REDIS_URL=
NODE_ENV=development
PORT=5000

JWT_SECRET=

CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```
### client side ( .env.local )

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

&nbsp;

# Running Both Services

Start the server and client in separate terminals.

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

## Notes

- Make sure required environment variables are configured for both `client` and `server`.
- Ensure your database( PostgreSQL ) and Redis services are running before starting the backend.