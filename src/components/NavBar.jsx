import React from 'react'
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';

export default function NavBar() {
  return (
    <Flex width="100%">
      <Button flex="1" bg="grey" color="Black">
        Home
      </Button>
      <Button p="4" bg="grey" flex="6" color="Black">
        Ear Trainer
      </Button>
    </Flex>
  )
}
