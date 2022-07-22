import moment from 'moment'

export function formatTime(ts, format) {
  return moment(ts.toDate ? ts.toDate() : ts).format(format)
}
