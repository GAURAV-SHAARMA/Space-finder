import sql from "mssql";

const serverSetting = process.env.SQL_SERVER || "localhost";
const [server, instanceName] = serverSetting.split("\\", 2);
const port = process.env.SQL_PORT ? Number(process.env.SQL_PORT) : undefined;

if (!process.env.SQL_DATABASE || !process.env.SQL_USER || !process.env.SQL_PASSWORD) {
  throw new Error("Set SQL_DATABASE, SQL_USER, and SQL_PASSWORD in .env before starting the API.");
}

export const pool = new sql.ConnectionPool({
  server,
  ...(port ? { port } : {}),
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    ...(instanceName ? { instanceName } : {}),
    encrypt: process.env.SQL_ENCRYPT !== "false",
    trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === "true",
  },
});

export { sql };
