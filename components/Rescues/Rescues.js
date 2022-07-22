import {
  Avatar,
  Box,
  Flex,
  Heading,
  Select,
  Tag,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import axios from 'axios'
import { useAuth } from 'contexts'
import { formatTime } from 'helpers'
import { useIsMobile } from 'hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export function Rescues({ initialData }) {
  const user = useAuth()
  const { push, query } = useRouter()
  const [status, setStatus] = useState(query.status || 'scheduled')
  const limit = 10
  const { data, refetch } = useQuery(
    'rescues',
    async () => {
      const token = await user.getIdToken()
      if (!token) return
      const res = await axios.get(
        `/api/rescues?token=${token}&limit=5&status=${status}`
      )
      return res.data
    },
    { initialData }
  )

  useEffect(() => {
    const params = new URLSearchParams({ status, limit })
    push('/rescues?' + params.toString(), undefined, { shallow: true })
    refetch()
  }, [status, user])

  return (
    <Box w="100%">
      <StatusSelect status={status} setStatus={setStatus} />
      {data &&
        data.map(rescue => <RescueCard rescue={rescue} key={rescue.id} />)}
    </Box>
  )
}

function RescueCard({ rescue }) {
  const cardColor = useColorModeValue('card-light', 'card-dark')

  return (
    <Link href={`/rescues/${rescue.id}`}>
      <Box
        my={6}
        boxShadow="md"
        borderRadius="md"
        p={4}
        w="100%"
        bg={cardColor}
        cursor="pointer"
      >
        <CardHeader rescue={rescue} />
        <Box h={4} />
        <CardTags rescue={rescue} />
      </Box>
    </Link>
  )
}

function CardHeader({ rescue }) {
  const subtextColor = useColorModeValue('gray.400', 'gray.500')
  return (
    <Flex align="center">
      <Avatar
        src={rescue.handler?.icon}
        name={rescue.handler?.name}
        bg="gray.400"
        color="white"
      />
      <Box w={4} />
      <Flex direction="column">
        <Heading as="h4" size="md">
          {rescue.handler?.name || 'Available Rescue'}
        </Heading>
        <Text color={subtextColor} fontSize="xs">
          {formatTime(
            rescue.timestamp_scheduled_start,
            'dddd, MMMM DD - h:mma'
          )}
        </Text>
      </Flex>
    </Flex>
  )
}

function CardTags({ rescue }) {
  const isMobile = useIsMobile()
  const greenTextColor = useColorModeValue('green.primary', 'green.light')
  const blueTextColor = useColorModeValue('blue.primary', 'blue.light')

  return (
    <Flex wrap="wrap" noOfLines={2}>
      {rescue.stops.map(stop => (
        <Tag
          key={stop.id}
          size="sm"
          bg={stop.type === 'pickup' ? 'green.subtle' : 'blue.subtle'}
          color={stop.type === 'pickup' ? greenTextColor : blueTextColor}
          borderRadius="xl"
          flexShrink={0}
          mr="1"
        >
          {stop.organization.name.length > 13 && isMobile
            ? stop.organization.name.substr(0, 13) + '...'
            : stop.organization.name}
        </Tag>
      ))}
    </Flex>
  )
}

function StatusSelect({ status, setStatus }) {
  return (
    <Select
      variant="outline"
      onChange={e => setStatus(e.target.value)}
      value={status}
    >
      <option value="available">Available</option>
      <option value="scheduled">Scheduled</option>
      <option value="active">Active</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </Select>
  )
}
