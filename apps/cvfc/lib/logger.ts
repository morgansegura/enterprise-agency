import "server-only";

/**
 * Structured logger. One JSON object per line in production so Vercel's log
 * drains stay queryable/filterable; readable key-value output in development.
 * Server-only — client components should surface problems in the UI, not log.
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

  // The console is this logger's transport; everywhere else no-console applies.
  const write = console[level === "debug" ? "log" : level].bind(console);

  if (PRETTY) {
    const tail = Object.keys(payload).length ? payload : "";
    write(`${level.toUpperCase()} [${scope}] ${msg}`, tail);
    return;
  }

  write(
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
