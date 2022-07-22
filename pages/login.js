import {
  AuthAction,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import { Flex, Button, Heading, Box } from '@chakra-ui/react'
import { Loading } from 'components'
import firebase from 'firebase/app'
import 'firebase/auth'
import Image from 'next/image'

function login() {
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  return (
    <Flex h="100%" w="100%" justify="center" align="center" direction="column">
      <Image src="/logo.png" height="192" width="192" />
      <Box h="6" />
      <Heading as="h1" fontSize="4xl" fontWeight="800">
        Sharing Excess
      </Heading>
      <Box h="2" />
      <Heading as="h3" fontSize="lg" fontWeight="300" color="gray.300">
        Let's free food!
      </Heading>
      <Box h="8" />
      <Button onClick={signInWithGoogle} bg="brand.primary">
        Login with Google
      </Button>
    </Flex>
  )
}

const AuthLoading = () => <Loading message="Signing In" />

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: AuthLoading,
})(login)
