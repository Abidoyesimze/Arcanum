// Utility functions for contract interactions

/**
 * Convert a number to u256 format (low, high)
 */
export function toU256(value: number | bigint): { low: bigint; high: bigint } {
  const val = BigInt(value)
  const low = val & ((BigInt(1) << BigInt(128)) - BigInt(1))
  const high = val >> BigInt(128)
  return { low, high }
}

/**
 * Convert u256 format to bigint
 */
export function fromU256(u256: { low: bigint; high: bigint }): bigint {
  return (BigInt(u256.high) << BigInt(128)) + BigInt(u256.low)
}

/**
 * Generate a random commitment for privacy
 */
export function generateCommitment(): string {
  // Generate a random 252-bit number (felt252)
  const randomBytes = new Uint8Array(32)
  crypto.getRandomValues(randomBytes)

  // Convert to hex string
  const hex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return "0x" + hex.slice(0, 62) // felt252 is 252 bits
}

/**
 * Format token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10) ** BigInt(decimals)
  const whole = amount / divisor
  const fraction = amount % divisor

  if (fraction === BigInt(0)) {
    return whole.toString()
  }

  const fractionStr = fraction.toString().padStart(decimals, "0")
  return `${whole}.${fractionStr}`
}

/**
 * Parse token amount to wei/smallest unit
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".")
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals)
  return BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt(paddedFraction)
}
