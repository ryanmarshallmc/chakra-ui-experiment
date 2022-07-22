import { useBreakpointValue } from '@chakra-ui/react'

export function useIsMobile() {
  const isMobile = useBreakpointValue({
    base: true,
    sm: true,
    md: true,
    lg: false,
  })
  return isMobile
}
