import { db } from 'server/firebaseAdmin'
import moment from 'moment-timezone'
import { formatDocumentTimestamps } from 'server/utils'

export async function getRescues({
  date,
  status,
  handler_id,
  start_after,
  limit = 100,
}) {
  console.log(date, status, handler_id, start_after, limit)
  const start = performance.now()
  const rescues = []

  let rescues_query = db.collection('rescues')

  let start_after_ref
  if (start_after) {
    await db
      .collection('rescues')
      .doc(start_after)
      .get()
      .then(doc => {
        start_after_ref = doc
      })
  }

  // apply filters

  if (date) {
    const start = new Date(date)
    const end = moment(start).add(24, 'hours').toDate()
    console.log(start, end)
    rescues_query = rescues_query
      .where('timestamp_scheduled_start', '>=', start)
      .where('timestamp_scheduled_start', '<=', end)
  }

  if (handler_id) {
    rescues_query = rescues_query.where('handler_id', '==', handler_id)
  }

  if (status) {
    rescues_query = rescues_query.where('status', '==', status)
  }

  if (limit) {
    rescues_query = rescues_query.limit(parseInt(limit))
  }

  if (start_after) {
    rescues_query = rescues_query
      .orderBy('timestamp_scheduled_start', 'desc')
      .startAfter(start_after_ref)
  } else {
    rescues_query = rescues_query.orderBy('timestamp_scheduled_start', 'desc')
  }

  // execute rescues query

  await rescues_query.get().then(snapshot => {
    snapshot.forEach(doc =>
      rescues.push({ ...formatDocumentTimestamps(doc.data()), stops: [] })
    )
  })

  console.log(
    'finished rescue query:',
    (performance.now() - start) / 1000,
    'seconds'
  )

  // execute query for all stops within rescues, and handler for rescue
  await Promise.all([
    ...rescues.map(rescue =>
      rescue.handler_id
        ? db
            .collection('users')
            .doc(rescue.handler_id)
            .get()
            .then(
              doc => (rescue.handler = formatDocumentTimestamps(doc.data()))
            )
        : null
    ),
    ...rescues.map(rescue =>
      db
        .collection('stops')
        .where('rescue_id', '==', rescue.id)
        .get()
        .then(snapshot =>
          snapshot.forEach(doc =>
            rescue.stops.push(formatDocumentTimestamps(doc.data()))
          )
        )
    ),
  ])

  console.log(
    'finished handler/stop queries:',
    (performance.now() - start) / 1000,
    'seconds'
  )

  // execute query for organization and location for each stop

  await Promise.all(
    rescues
      .map(rescue => [
        ...rescue.stops.map(stop =>
          db
            .collection('organizations')
            .doc(stop.organization_id)
            .get()
            .then(doc => {
              const org = formatDocumentTimestamps(doc.data())
              // console.log('got org', org)
              stop.organization = org
            })
        ),
        ...rescue.stops.map(stop =>
          db
            .collection('locations')
            .doc(stop.location_id)
            .get()
            .then(doc => {
              const loc = formatDocumentTimestamps(doc.data())
              // console.log('got loc', loc)
              stop.location = loc
            })
        ),
      ])
      .flat()
  )

  console.log(
    'finished org/loc queries:',
    (performance.now() - start) / 1000,
    'seconds'
  )

  console.log(
    'returning rescues:',
    rescues.map(i => i.id)
  )

  console.log(
    'getRescues execution time:',
    (performance.now() - start) / 1000,
    'seconds'
  )
  return rescues
}
