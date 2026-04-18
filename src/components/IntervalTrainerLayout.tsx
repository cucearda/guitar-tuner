import React from "react";
import PlayButton from "./PlayButton";
import { Flex, HStack, Box } from "@chakra-ui/react";
import NavBar from "./NavBar";
import IntervalTrainerOptions from "./IntervalTrainerOptions";
import { useState, useEffect } from "react";
import { intervalNameConstants } from "../models/interval";
import IntervalTrainerQuestion from "./IntervalTrainerQuestion";
import { InstrumentType, Instrument } from "../audio/instrument";

export default function IntervalTrainerLayout() {
  // Committed selections
  const [selectedIntervals, setSelectedIntervals] = useState([
    ...intervalNameConstants,
  ]);
  const [selectedOctaves, setSelectedOctaves] = useState([3, 4]);
  const [selectedPlayOrder, setSelectedPlayOrder] = useState("Ascending");
  const [instrumentType, setInstrumentType] = useState(InstrumentType.CLASSIC);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [correctGuessesCount, setCorrectGuessesCount] = useState(0);
  const [totalGuessesCount, setTotalGuessesCount] = useState(0);

  useEffect(() => {
    console.log("Instrument type changed:", instrumentType);
    const createInstrument = async () => {
      let instrument: Instrument | null = null;
      try {
        instrument = await Instrument.create(instrumentType);
      } catch (error) {
        console.error("Error creating instrument:", error);
      }
      setInstrument(instrument);
    };
    createInstrument();
  }, [instrumentType]);

  return (
    <Flex height={"100%"}>
      <HStack height="100%" gap="0">
        <IntervalTrainerOptions
          selectedIntervals={selectedIntervals}
          selectedOctaves={selectedOctaves}
          selectedPlayOrder={selectedPlayOrder}
          setSelectedIntervals={setSelectedIntervals}
          setSelectedOctaves={setSelectedOctaves}
          setSelectedPlayOrder={setSelectedPlayOrder}
          selectedInstrumentType={instrumentType}
          setInstrumentType={setInstrumentType}
        />
      </HStack>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <IntervalTrainerQuestion
          selectedIntervals={selectedIntervals}
          selectedOctaves={selectedOctaves}
          selectedPlayOrder={selectedPlayOrder}
          instrument={instrument}
          setTotalGuessesCount={setTotalGuessesCount}
          setCorrectGuessesCount={setCorrectGuessesCount}
          correctGuessesCount={correctGuessesCount}
          totalGuessesCount={totalGuessesCount}
        />
      </Box>
    </Flex>
  );
}
