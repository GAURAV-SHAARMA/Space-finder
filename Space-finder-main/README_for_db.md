# SQL Server Database Setup

This project uses **Microsoft SQL Server** with a local **SQL Server Express (`SQLEXPRESS`)** instance for storing application data such as spaces and reviews.

## 1. Prerequisites

Make sure the following are installed:

- Microsoft SQL Server Express
- SQL Server Management Studio (SSMS) or VS Code SQL Server extension
- Node.js and npm

The SQL Server instance used by the project is:

```text
localhost\SQLEXPRESS
```

---

## 2. Enable TCP/IP

For the Node.js application to communicate with SQL Server through TCP:

1. Open **SQL Server Configuration Manager**.
2. Go to:

```text
SQL Server Network Configuration
→ Protocols for SQLEXPRESS
```

3. Right-click **TCP/IP** → **Enable**.
4. Open **TCP/IP → Properties**.
5. Go to the **IP Addresses** tab.
6. Under **IPAll**, set:

```text
TCP Dynamic Ports:   [empty]
TCP Port:            1433
```

7. Click **OK**.
8. Restart:

```text
SQL Server (SQLEXPRESS)
```

---

## 3. Create the Database

Connect to SQL Server using **Windows Authentication**:

```text
Server:
localhost\SQLEXPRESS

Authentication:
Windows Authentication
```

Create the application database:

```sql
CREATE DATABASE space_finder;
GO
```

The project uses:

```text
Database Name: space_finder
```

---

## 4. Create the SQL Server Login

The Node.js backend uses SQL Server Authentication.

Create the login:

```sql
USE master;
GO

CREATE LOGIN [space_finder_app]
WITH PASSWORD = 'gaurav01';
GO

ALTER LOGIN [space_finder_app] ENABLE;
GO
```

> **Security note:** For a real production application, use a strong password and store it securely rather than committing it to GitHub.

---

## 5. Create Database User

The server login must also have a user inside the `space_finder` database.

Run:

```sql
USE [space_finder];
GO

CREATE USER [space_finder_app]
FOR LOGIN [space_finder_app];
GO
```

Give the application user the required database permissions:

```sql
ALTER ROLE [db_owner]
ADD MEMBER [space_finder_app];
GO
```

---

## 6. Environment Variables

Create a `.env` file in the project root:

```env
SQL_SERVER=127.0.0.1
SQL_PORT=1433
SQL_DATABASE=space_finder
SQL_USER=space_finder_app
SQL_PASSWORD=gaurav01
SQL_ENCRYPT=false
SQL_TRUST_SERVER_CERTIFICATE=true

API_PORT=3001
```

### Configuration Explanation

| Variable | Purpose |
|---|---|
| `SQL_SERVER` | SQL Server host |
| `SQL_PORT` | SQL Server TCP port |
| `SQL_DATABASE` | Application database |
| `SQL_USER` | SQL Server login |
| `SQL_PASSWORD` | Login password |
| `SQL_ENCRYPT` | Encryption setting for local development |
| `SQL_TRUST_SERVER_CERTIFICATE` | Allows the local SQL Server certificate |
| `API_PORT` | Port used by the Node.js API |

**Do not commit `.env` to GitHub.** Add it to `.gitignore`:

```gitignore
.env
```

---

## 7. Database Setup Script

The project contains:

```text
server/setup-database.js
```

The database setup command is defined in `package.json` as:

```json
"db:setup": "node server/setup-database.js"
```

Run:

```bash
npm run db:setup
```

The setup script connects to SQL Server using the credentials from `.env` and prepares the required database structure and sample data.

A successful setup produces:

```text
Database ready: 8 spaces and 5 sample reviews seeded.
```

This confirms that the Node.js application successfully connected to SQL Server.

---

## 8. Running the Backend

The backend API is defined in:

```text
server/index.js
```

Start it with:

```bash
npm run dev:api
```

The API runs on:

```text
http://localhost:3001
```

---

## 9. Running the Frontend

The frontend uses Vite.

Start it in another terminal:

```bash
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

The frontend communicates with the Node.js API through endpoints such as:

```text
/api/spaces
/api/reviews
```

The overall architecture is:

```text
┌──────────────────────────┐
│      React + Vite        │
│   localhost:5173         │
└────────────┬─────────────┘
             │
             │ /api/spaces
             │ /api/reviews
             ▼
┌──────────────────────────┐
│       Node.js API        │
│   localhost:3001         │
│                          │
│   server/index.js        │
└────────────┬─────────────┘
             │
             │ SQL connection
             ▼
┌──────────────────────────┐
│   SQL Server Express     │
│   localhost\SQLEXPRESS   │
│   Port: 1433             │
│                          │
│   Database: space_finder │
└──────────────────────────┘
```

---

## 10. Useful Commands

### Install dependencies

```bash
npm install
```

### Setup database

```bash
npm run db:setup
```

### Start backend

```bash
npm run dev:api
```

### Start frontend

```bash
npm run dev
```

### Build frontend

```bash
npm run build
```

---

## Troubleshooting

### Login failed for `space_finder_app`

Check that the SQL Server login exists:

```sql
SELECT name
FROM sys.server_principals
WHERE name = 'space_finder_app';
```

Also verify that the password in `.env` matches the SQL Server login.

### Database does not exist

Check:

```sql
SELECT name
FROM sys.databases
WHERE name = 'space_finder';
```

### Port 1433 is not accessible

Test from PowerShell:

```powershell
Test-NetConnection 127.0.0.1 -Port 1433
```

You want:

```text
TcpTestSucceeded : True
```

### Vite shows `ECONNREFUSED /api/spaces`

Make sure the backend is running:

```bash
npm run dev:api
```

The frontend and backend must run in **separate terminals**.

---

## Database Connection Summary

```text
Frontend
   ↓
React/Vite
   ↓
Node.js API
   ↓
SQL Server Driver
   ↓
SQL Server Express
   ↓
space_finder database
   ↓
Spaces / Reviews data
```

This setup provides a local SQL Server database for the Space Finder application's backend.
