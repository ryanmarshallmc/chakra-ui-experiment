import { getRescue } from 'requests'
import { authenticateRequest, rejectUnauthorizedRequest } from 'server/auth'

export default async function rescueEndpoint(request, response) {
  return new Promise(async resolve => {
    try {
      console.log('INVOKING ENDPOINT: rescue()\n', 'params:', {
        ...request.params,
        ...request.query,
      })

      // const { id } = request.params
      const { id, token } = request.query

      if (!id) {
        response.status(400).send('No id param received in request URL.')
        return
      }

      // load base rescue object from DB
      const rescue = await getRescue(id)

      if (!rescue) {
        response.status(200).send(null)
      }

      // we wait until here to authenticate the request so we can see if this is the
      // driver's own route (that data isn't available until after we fetch the rescue)
      const requestIsAuthenticated = await authenticateRequest(
        token,
        user => user.is_admin || (rescue && user.id === rescue.handler_id)
      )

      if (!requestIsAuthenticated) {
        rejectUnauthorizedRequest(response)
        return
      }

      response.status(200).send(JSON.stringify(rescue))
      // use resolve to allow the cloud function to close
      resolve()
    } catch (e) {
      console.error('Caught error:', e)
      response.status(500).send(e.toString())
    }
  })
}
