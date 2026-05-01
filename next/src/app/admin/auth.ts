/**
 * Admin route gate — env-token check (Phase 97 ADM-01).
 *
 * Compares supplied token against process.env.ADMIN_TOKEN with constant-time
 * comparison. Fail-closed: returns false if env is unset/empty or supplied
 * is null/undefined/empty.
 *
 * Runs in BOTH Node and Edge runtimes. Node uses crypto.timingSafeEqual via
 * Buffer; Edge uses a manual constant-time XOR loop on UTF-8 bytes. Both
 * paths execute a same-length dummy compare on length mismatch to avoid
 * leaking expected-token length via timing.
 *
 * SECURITY: never logs the token, the env value, or the comparison result.
 */

function constantTimeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  // Manual constant-time compare on equal-length byte arrays.
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function utf8Bytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

export function checkAdminToken(
  supplied: string | null | undefined
): boolean {
  const expected = process.env.ADMIN_TOKEN;

  // Fail-closed: missing or empty config or supplied
  if (!expected || expected.length === 0) return false;
  if (!supplied || supplied.length === 0) return false;

  const expectedBytes = utf8Bytes(expected);
  const suppliedBytes = utf8Bytes(supplied);

  if (suppliedBytes.length !== expectedBytes.length) {
    // Same-length dummy compare to avoid leaking length via timing.
    // Compare expected to itself to consume equivalent CPU cycles.
    constantTimeEqualBytes(expectedBytes, expectedBytes);
    return false;
  }

  return constantTimeEqualBytes(suppliedBytes, expectedBytes);
}
