// Time helpers for the practice project.

const pad = (n) => String(n).padStart(2, "0");

export function formatDuration(totalSeconds) {
  if (typeof totalSeconds !== "number" || !Number.isInteger(totalSeconds) || totalSeconds < 0) {
    throw new TypeError("formatDuration expects a non-negative whole number of seconds");
  }
  if (totalSeconds < 60) return `${totalSeconds}s`;
  if (totalSeconds < 3600) {
    return `${Math.floor(totalSeconds / 60)}m ${pad(totalSeconds % 60)}s`;
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${pad(minutes)}m`;
}
