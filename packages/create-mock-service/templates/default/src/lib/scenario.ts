const scenarios = new Map<string, string>();

export function getScenario(routeKey: string): string {
  return scenarios.get(routeKey) ?? 'default';
}

export function setScenario(routeKey: string, scenario: string): void {
  scenarios.set(routeKey, scenario);
}

export function clearScenarios(): void {
  scenarios.clear();
}

export function listScenarios(): Record<string, string> {
  return Object.fromEntries(scenarios);
}
