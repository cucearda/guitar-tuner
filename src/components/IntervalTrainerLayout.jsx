import React from "react";
import PlayButton from "./PlayButton";
import { Flex, HStack } from "@chakra-ui/react";
import NavBar from "./NavBar";
import IntervalTrainerOptions from "./IntervalTrainerOptions";
import { useState } from "react";
import { intervalNameConstants } from "../models/interval";

export default function IntervalTrainerLayout() {
  // Committed selections
  const [selectedIntervals, setSelectedIntervals] = useState([...intervalNameConstants]);
  const [selectedOctaves, setSelectedOctaves] = useState([3, 4]);
  const [selectedPlayOrder, setSelectedPlayOrder] = useState("Ascending");
  return (
    <>
      <NavBar />
      <HStack height="100%" gap="0">
        <IntervalTrainerOptions 
          selectedIntervals={selectedIntervals} 
          selectedOctaves={selectedOctaves} 
          selectedPlayOrder={selectedPlayOrder} 
          setSelectedIntervals={setSelectedIntervals} 
          setSelectedOctaves={setSelectedOctaves} 
          setSelectedPlayOrder={setSelectedPlayOrder} 
        />
        <PlayButton
          selectedIntervals={selectedIntervals}
          selectedOctaves={selectedOctaves}
          selectedPlayOrder={selectedPlayOrder}
        />
      </HStack>
    </>
  );
}
