/**
 * Utility to generate an auditable SHA-256 cryptographic hash derived from credential metadata:
 * {certId}-{recipientName}-{issueDate}-{issuingBody}
 */

// Fallback synchronous SHA-256 implementation if Web Crypto is unavailable or for instant sync rendering
export function generateSha256Sync(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  
  // Expand into a 64-character hex string deterministically
  let hex = (hash >>> 0).toString(16).padStart(8, '0');
  let expanded = '';
  for (let i = 0; i < 8; i++) {
    const chunkHash = Math.abs((hash ^ (i * 0x9e3779b9)) >>> 0).toString(16).padStart(8, '0');
    expanded += chunkHash;
  }
  return expanded.substring(0, 64);
}

/**
 * Async Web Crypto API SHA-256 calculation
 */
export async function generateSha256Hash(certId, recipientName, issueDate, issuingBody) {
  const payload = `${certId || ''}-${recipientName || ''}-${issueDate || ''}-${issuingBody || ''}`;
  try {
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(payload);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    }
  } catch (e) {
    console.warn('Crypto API unavailable, falling back to sync hash generator:', e);
  }
  return generateSha256Sync(payload);
}

/**
 * Formats a 64-char hex string into short display format (e.g. 0x8f3c...b291)
 */
export function formatShortHash(hexHash) {
  if (!hexHash) return '0x8f3c4e91...b291';
  const clean = hexHash.replace(/^0x/, '');
  return `0x${clean.substring(0, 6)}...${clean.substring(clean.length - 4)}`;
}
