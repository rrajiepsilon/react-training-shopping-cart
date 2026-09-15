export function optimizedProductImage(url, width = 540) {
  if (!url) return url;
  const hostPath = url.replace(/^https?:\/\//, "");
  return `https://wsrv.nl/?url=${encodeURIComponent(hostPath)}&w=${width}&q=70&output=webp`;
}
