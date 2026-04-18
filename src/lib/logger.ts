interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: unknown;
  responseStatus: number;
  durationMs: number;
  scenario: string;
}

const logs: LogEntry[] = [];
const MAX_LOGS = 100;

export function addLog(entry: LogEntry): void {
  logs.unshift(entry);
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }
}

export function getLogs(limit = 50): LogEntry[] {
  return logs.slice(0, limit);
}

export function clearLogs(): void {
  logs.length = 0;
}
