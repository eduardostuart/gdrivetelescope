export default function prettySize (bytes: number, separator = ''): string {
  let size = 'n/a'

  if (bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.min(parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10), sizes.length - 1)
    size = `${(bytes / (1024 ** i)).toFixed(i ? 1 : 0)}${separator}${sizes[i]}`
  }

  return size
}
