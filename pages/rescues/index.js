import { Page, Rescues } from 'components'
import { withAuth } from 'helpers'
// import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'
// import { getRescues } from 'requests'

function rescues({ initialData }) {
  return (
    <Page
      id="Rescues"
      title="Rescues"
      breadcrumbs={[{ label: 'Rescues', link: '/rescues' }]}
    >
      <Rescues initialData={initialData} />
    </Page>
  )
}

// export const getServerSideProps = withAuthUserTokenSSR({
//   whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
// })(async ({ AuthUser, query }) => {
//   const initialData = await getRescues(query)
//   return { props: { initialData } }
// })

export default withAuth(rescues)
