export function formatDuration(totalSeconds) {
  if (!Number.isInteger(totalSeconds) || totalSeconds < 0) {
    throw new TypeError("totalSeconds must be a non-negative integer");
  }
  const pad = (n) => String(n).padStart(2, "0");
  if (totalSeconds < 60) return `${totalSeconds}s`;
  if (totalSeconds < 3600) {
    return `${Math.floor(totalSeconds / 60)}m ${pad(totalSeconds % 60)}s`;
  }
  const hours = Math.floor(totalSeconds / 3600);
  return `${hours}h ${pad(Math.floor((totalSeconds % 3600) / 60))}m`;
}
