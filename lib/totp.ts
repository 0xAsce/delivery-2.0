import { createHmac, randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function randomBase32(bytes = 20) {
  const data = randomBytes(bytes);
  let bits = "";
  for (const b of data) bits += b.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i < bits.length; i += 5) out += ALPHABET[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
  return out;
}

function decodeBase32(input: string) {
  const clean = input.toUpperCase().replace(/=+$/, "");
  let bits = "";
  for (const c of clean) {
    const v = ALPHABET.indexOf(c);
    if (v >= 0) bits += v.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

export function totp(secret: string, timestamp = Date.now()) {
  const counter = Math.floor(timestamp / 30000);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const h = createHmac("sha1", decodeBase32(secret)).update(buf).digest();
  const offset = h[h.length - 1] & 15;
  const code = ((h[offset] & 127) << 24) | (h[offset + 1] << 16) | (h[offset + 2] << 8) | h[offset + 3];
  return String(code % 1000000).padStart(6, "0");
}

export function verifyTotp(secret: string, code: string) {
  const normalized = String(code || "").replace(/\D/g, "");
  return [-1, 0, 1].some(delta => totp(secret, Date.now() + delta * 30000) === normalized);
}
