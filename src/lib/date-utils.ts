// Format date to Lithuanian format
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Format time to HH:MM
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("lt-LT", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Format date and time
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Get day name in Lithuanian
export function getDayName(date: Date): string {
  return new Intl.DateTimeFormat("lt-LT", { weekday: "long" }).format(date);
}

// Get start of week (Monday)
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Get end of week (Sunday)
export function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

// Get days in month
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Get first day of month (0 = Sunday, 1 = Monday, etc.)
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Get week days array starting from Monday
export function getWeekDays(): string[] {
  return [
    "Pirmadienis",
    "Antradienis",
    "Trečiadienis",
    "Ketvirtadienis",
    "Penktadienis",
    "Šeštadienis",
    "Sekmadienis",
  ];
}

// Get short week days
export function getShortWeekDays(): string[] {
  return ["Pr", "An", "Tr", "Kt", "Pn", "Št", "Sk"];
}

// Get month names
export function getMonthNames(): string[] {
  return [
    "Sausis",
    "Vasaris",
    "Kovas",
    "Balandis",
    "Gegužė",
    "Birželis",
    "Liepa",
    "Rugpjūtis",
    "Rugsėjis",
    "Spalis",
    "Lapkritis",
    "Gruodis",
  ];
}
