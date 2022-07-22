import { Page } from 'components'
import { Auth } from 'contexts'
import { withAuth } from 'helpers'
import { useAuthUser, withAuthUserTokenSSR } from 'next-firebase-auth'

function index() {
  return (
    <Auth>
      <Page id="Home" title="Home"></Page>
    </Auth>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuth(index)
