import { Box, Button, Flex } from "@chakra-ui/react";
import {
  InstrumentFactory,
  InstrumentConfig,
  InstrumentType,
  Instrument,
} from "../audio/soundgenerator";
import * as Tone from "tone";
import { use, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import {Interval} from "../models/interval";
const baseUrl = "/guitar-tuner/audio/samples";



export default function PlayButton({ selectedIntervals, selectedOctaves, selectedPlayOrder }: { selectedIntervals: string[], selectedOctaves: number[], selectedPlayOrder: string }) {
  console.log("PlayButton rendered");
  const config = {
    type: InstrumentType.CLASSIC,
  } as InstrumentConfig;

  // Create the instrument and store it in state
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [randomInterval, setRandomInterval] = useState<Interval | null>(null);
  useEffect(() => {
    const createInstrument = async () => {
      const instrument = await InstrumentFactory.createInstrument(
        config,
        "fresh",
      );
      setInstrument(instrument);
    };
    createInstrument();
  }, []);
  const instrumentRef = useRef<Instrument | null>(null);

  const handleClick = () => {
    const randomInterval = Interval.createRandomInterval(selectedIntervals, selectedOctaves, selectedPlayOrder === "Ascending");
    Tone.loaded().then(() => {
      if (randomInterval && instrument) {
        console.log("Playing interval:", randomInterval.name, "Notes:", randomInterval.startingNote, randomInterval.endingNote);
        instrument.playNotes([randomInterval.startingNote+randomInterval.startingNoteOctave, randomInterval.endingNote+randomInterval.endingNoteOctave], "2n");
      }
      else{
        console.error("Instrument or random interval not ready");
      }
    });
  };

  return <Button onClick={() => handleClick()}>Play</Button>;
}