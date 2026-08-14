import "server-only";

/**
 * Structured logger. One JSON object per line in production so Vercel's log
 * drains stay queryable/filterable; readable key-value output in development.
 * Writes to stderr at every level — logs are diagnostics, stdout is reserved
 * for program output. Server-only: client components surface problems in the
 * UI, they don't log.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

type Fields = Record<string, unknown>;

const RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel | undefined) ??
  (process.env.NODE_ENV === "production" ? "info" : "debug");

const PRETTY = process.env.NODE_ENV !== "production";

/** Errors don't survive JSON.stringify — unwrap them into plain fields. */
function serialize(value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}

function emit(level: LogLevel, scope: string, msg: string, fields?: Fields) {
  if (RANK[level] < RANK[MIN_LEVEL]) return;

  const payload: Fields = {};
  for (const [key, value] of Object.entries(fields ?? {})) {
    if (value !== undefined) payload[key] = serialize(value);
  }

  // Every level goes to stderr: logs are diagnostics, stdout is for program
  // output. console.error is the portable way to reach it from any runtime.
  if (PRETTY) {
    const tail = Object.keys(payload).length ? payload : "";
    console.error(`${level.toUpperCase()} [${scope}] ${msg}`, tail);
    return;
  }

  console.error(
    JSON.stringify({
      level,
      scope,
      msg,
      time: new Date().toISOString(),
      ...payload,
    }),
  );
}

export type Logger = Record<LogLevel, (msg: string, fields?: Fields) => void>;

/** A logger bound to one subsystem, e.g. `createLogger("signup")`. */
export function createLogger(scope: string): Logger {
  return {
    debug: (msg, fields) => emit("debug", scope, msg, fields),
    info: (msg, fields) => emit("info", scope, msg, fields),
    warn: (msg, fields) => emit("warn", scope, msg, fields),
    error: (msg, fields) => emit("error", scope, msg, fields),
  };
}
