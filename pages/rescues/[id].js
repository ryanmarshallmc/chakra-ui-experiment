import { Page, Rescue } from 'components'
import { withAuth } from 'helpers'
import { useRouter } from 'next/router'
import { getRescue } from 'requests'
import { AuthAction, withAuthUserTokenSSR } from 'next-firebase-auth'

function rescues({ initialData }) {
  const { query } = useRouter()

  return (
    <Page
      id="Rescues"
      title={initialData.status ? initialData.status + ' Rescue' : 'Rescue'}
      breadcrumbs={[
        { label: 'Rescues', link: '/rescues' },
        { label: query.id, link: `/rescues/${query.id}` },
      ]}
    >
      <Rescue id={query.id} initialData={initialData} />
    </Page>
  )
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser, query }) => {
  const initialData = await getRescue(query.id)
  return { props: { initialData } }
})

export default withAuth(rescues)
