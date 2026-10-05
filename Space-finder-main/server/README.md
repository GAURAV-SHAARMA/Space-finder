# Space Finder Backend

The backend is a Node.js/Express API that stores space and review data in Microsoft SQL Server. The React app calls the API through Vite's `/api` development proxy.

## Requirements

- Node.js 20 or later
- Microsoft SQL Server (local or remote)
- A SQL Server login with access to the application database

The VS Code SQL Server extension is a client for connecting to SQL Server; it does not install or run the database engine.

## Configure the database connection

From the project root, create a local environment file:

```powershell
Copy-Item .env.example .env
notepad .env
```

Set the values to match your SQL Server. Never commit `.env` or share its password.

```env
SQL_SERVER=127.0.0.1
SQL_PORT=1433
SQL_DATABASE=space_finder
SQL_USER=your_sql_login
SQL_PASSWORD=your_sql_password
SQL_ENCRYPT=false
SQL_TRUST_SERVER_CERTIFICATE=true
API_PORT=3001
```

For a named SQL Server instance such as `localhost\SQLEXPRESS`, use `SQL_SERVER=localhost\SQLEXPRESS` and remove `SQL_PORT` if TCP/IP is configured to use a dynamic port. For a fixed TCP port, use the host/IP for `SQL_SERVER` and set that port in `SQL_PORT`.

The database itself must already exist. Create it using a SQL Server connection with permission to create databases:

```sql
CREATE DATABASE [space_finder];
```

## Create tables and seed sample data

Run from the project root (the directory containing `package.json`):

```powershell
npm install
npm run db:setup
```

The setup script creates `dbo.spaces` and `dbo.reviews` from `schema.sql`, then inserts the bundled sample records if their IDs are not already present. It is safe to rerun for seeding; existing records are not overwritten.

## Start the API

```powershell
npm run dev:api
```

By default the API listens at `http://localhost:3001`. Set `API_PORT` in `.env` to change the port. Verify the database connection and API with:

```powershell
Invoke-RestMethod http://localhost:3001/api/health
```

Keep this terminal running. Start the frontend in a second terminal from the project root with `npm run dev`.

## Interactive map

The map page uses Leaflet with OpenStreetMap tiles and the coordinates stored for each space. It requires no API key. Markers show accessibility scores, and the score overlay displays approximate circles around mapped spaces; it is not live crowd-density data. The nearby-line option draws a straight line between a selected space and its closest other space; it is not turn-by-turn routing.

OpenStreetMap tile servers are provided under their [tile usage policy](https://operations.osmfoundation.org/policies/tiles/). Keep the required OpenStreetMap attribution visible. The public tile service is not unlimited or guaranteed production infrastructure; use a suitable tile provider or host tiles for higher-volume deployments.

## API endpoints

### `GET /api/health`

Checks that the API can query SQL Server.

### `GET /api/spaces`

Returns all spaces. `features` and `nearbyFacilities` are returned as JSON arrays.

### `GET /api/spaces/:id`

Returns one space by positive integer ID. Returns `400` for an invalid ID and `404` if no matching space exists.

### `GET /api/reviews`

Returns all reviews, newest first. Optionally filter by space:

```text
GET /api/reviews?spaceId=1
```

### `POST /api/reviews`

Creates a review, then updates the space's rating and review count in the same database transaction. Send JSON:

```json
{
  "spaceId": 1,
  "user": "Guest User",
  "avatar": "GU",
  "rating": 5,
  "comment": "Accessible and comfortable."
}
```

`spaceId` must identify an existing space, `rating` must be an integer from 1 to 5, and `comment` must contain 1 to 2,000 characters. The API responds with the created review and HTTP `201`.

## Troubleshooting

- **Login failed:** confirm SQL Server Authentication is enabled if using a SQL login, and that `SQL_USER` and `SQL_PASSWORD` match the login. Restart SQL Server after changing its authentication mode.
- **Connection timeout:** confirm the SQL Server service is running and TCP/IP is enabled. If using a fixed port, verify it is listening (for example, `Test-NetConnection 127.0.0.1 -Port 1433`) and set the matching `SQL_PORT`.
- **Database does not exist:** create `space_finder` first, then rerun `npm run db:setup`.
- **Environment variables appear missing:** ensure `.env` is in the project root beside `package.json`, not inside `server/`.
