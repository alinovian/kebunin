import mysql from "mysql2/promise";

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

globalThis._mysqlPool = undefined;
 
export function getDbPool(): mysql.Pool {
  if (!globalThis._mysqlPool) {
    const host = process.env.DB_HOST || "127.0.0.1";
    const port = parseInt(process.env.DB_PORT || "3306", 10);
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const database = process.env.DB_NAME || "kebunin_v2";

    globalThis._mysqlPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return globalThis._mysqlPool;
}
