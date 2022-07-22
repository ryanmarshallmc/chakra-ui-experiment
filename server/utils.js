import moment from 'moment-timezone'

export function formatDocumentTimestamps(data) {
  const copy = { ...data }
  for (const key in copy) {
    if (key.includes('timestamp_')) {
      copy[key] = formatTimestamp(copy[key])
    }
  }
  return copy
}

export function formatTimestamp(timestamp) {
  if (timestamp) {
    if (timestamp.toDate) {
      return moment(timestamp.toDate()).tz('America/New_York').format()
    } else {
      return moment(new Date(timestamp)).tz('America/New_York').format()
    }
  } else {
    return null
  }
}
