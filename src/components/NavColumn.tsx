import React, { Children } from 'react'
import { VStack } from "@chakra-ui/react";


export default function NavColumn({ children }: { children: React.ReactNode }) {

    return (
    <VStack p="4" borderRightWidth={"1px"} height={"100vh"} align="stretch" minW="160px">
        {children}
    </VStack>
  )
}
