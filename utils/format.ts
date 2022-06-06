

// short address length
export function formatAddress(address: string | undefined, length: number) {
  if (!address) return
  return `${address.substring(0, length + 2)}…${address.substring(
    address.length - length
  )}`
}