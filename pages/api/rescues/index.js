import { getRescues } from 'requests'
import { authenticateRequest, rejectUnauthorizedRequest } from 'server/auth'

export default async function rescuesEndpoint(request, response) {
  try {
    console.log('INVOKING ENDPOINT: rescues()\n', 'params:', request.query)
    const { date, status, handler_id, limit, start_after, token } =
      request.query

    const requestIsAuthenticated = await authenticateRequest(
      token,
      user => user.is_admin || (handler_id && user.id === handler_id)
    )

    if (!requestIsAuthenticated) {
      rejectUnauthorizedRequest(response)
      return
    }
    const rescues = await getRescues({
      date,
      status,
      handler_id,
      start_after,
      limit,
    })
    response.status(200).send(JSON.stringify(rescues))
  } catch (e) {
    console.error('Caught error:', e)
    response.status(500).send(e.toString())
  }
}
