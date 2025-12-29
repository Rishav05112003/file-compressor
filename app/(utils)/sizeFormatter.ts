export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizeUnits = ["Bytes", "KB", "MB", "GB", "TB"];

  const index = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, index)).toFixed(dm)) + " " + sizeUnits[index];
};
