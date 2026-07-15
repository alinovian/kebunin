import { m as mysql } from "../_libs/mysql2.mjs";
import "events";
import "process";
import "net";
import "tls";
import "timers";
import "zlib";
import "url";
import "../_libs/react.mjs";
import "../_libs/sql-escaper.mjs";
import "node:buffer";
import "../_libs/lru.min.mjs";
import "stream";
import "../_libs/denque.mjs";
import "buffer";
import "../_libs/long.mjs";
import "../_libs/iconv-lite.mjs";
import "string_decoder";
import "../_libs/safer-buffer.mjs";
import "crypto";
import "../_libs/generate-function.mjs";
import "util";
import "../_libs/is-property.mjs";
import "../_libs/aws-ssl-profiles.mjs";
import "../_libs/named-placeholders.mjs";
globalThis._mysqlPool = void 0;
function getDbPool() {
  if (!globalThis._mysqlPool) {
    const host = process.env.DB_HOST || "127.0.0.1";
    const port = parseInt(process.env.DB_PORT || "3306", 10);
    const user = process.env.DB_USER || "root";
    const password = process.env.DB_PASSWORD || "";
    const database = process.env.DB_NAME || "kebunin_v2";
    const isLocal = host === "127.0.0.1" || host === "localhost";
    const ssl = !isLocal ? { rejectUnauthorized: false } : void 0;
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
      ssl
    });
  }
  return globalThis._mysqlPool;
}
export {
  getDbPool
};
