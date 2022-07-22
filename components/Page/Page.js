import Head from 'next/head'
import {
  Avatar,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'components'
import { useIsMobile } from 'hooks'
import { Auth, useAuth } from 'contexts'

export function Page({ id, title, children, breadcrumbs }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Auth>
      <Box
        as="main"
        id={id}
        className="se-page"
        h="100%"
        w="100%"
        p={['16px', '18px', '24px', '32px', '48px']}
      >
        <HTMLHead title={title} />
        <PageHead breadcrumbs={breadcrumbs} openMenu={onOpen} />
        <Flex h="calc(100% - 80px)" w="100%" justify="center">
          <Menu isOpen={isOpen} onClose={onClose} />
          <Box
            as="section"
            className="se-page-content"
            w="100%"
            maxW="640"
            h="100%"
            overflowY="auto"
          >
            <Heading
              as="h1"
              fontWeight="700"
              size="2xl"
              mb="24px"
              textTransform="capitalize"
            >
              {title}
            </Heading>
            {children}
          </Box>
        </Flex>
      </Box>
    </Auth>
  )
}

function HTMLHead({ title }) {
  return (
    <Head>
      <link rel="shortcut icon" href="/logo.png" />
      <title>{title}</title>
    </Head>
  )
}

function PageHead({ breadcrumbs, openMenu }) {
  const isMobile = useIsMobile()
  return (
    <Flex
      as="header"
      className="se-page-header"
      align="center"
      justify="start"
      pb="24px"
      maxW="984"
      m="auto"
    >
      <HomeButton />
      <Box w="1" />
      {breadcrumbs && (
        <Breadcrumb separator={<ChevronRightIcon color="gray.400" />}>
          <BreadcrumbItem m="0" />
          {breadcrumbs.map((crumb, i) => {
            const isCurrentPage = i === breadcrumbs.length - 1
            return (
              <BreadcrumbItem m="0" key={i} isCurrentPage={isCurrentPage}>
                <BreadcrumbLink
                  href={crumb.link}
                  fontWeight={isCurrentPage ? 'medium' : 'light'}
                  textDecoration={isCurrentPage ? 'none' : 'underline'}
                >
                  {crumb.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
      )}
      {isMobile && <MenuButton openMenu={openMenu} />}
    </Flex>
  )
}

function HomeButton() {
  return (
    <Link href="/">
      <a>
        <Image
          src="/logo.png"
          width="48"
          height="48"
          alt="Sharing Excess Logo"
        />
      </a>
    </Link>
  )
}

function MenuButton({ openMenu }) {
  const user = useAuth()
  return (
    <Avatar
      name={user.displayName}
      src={user.photoURL}
      ml="auto"
      onClick={openMenu}
      bg="brand.primary"
      color="white"
    />
  )
}
