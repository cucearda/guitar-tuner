import { Box, Button, Flex } from "@chakra-ui/react";
import {
  InstrumentType,
  Instrument,
} from "../audio/instrument";
import * as Tone from "tone";
import { use, useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import {Interval} from "../models/interval";
const baseUrl = "/guitar-tuner/audio/samples";



export default function PlayButton({ instrument, interval }: { instrument: Instrument | null; interval: Interval }) {
  console.log("PlayButton rendered");

  // Create the instrument and store it in state

  const handleClick = () => {
    Tone.loaded().then(() => {
      if(instrument) {
        instrument.playNotes([interval.startingNote + interval.startingNoteOctave, interval.endingNote + interval.endingNoteOctave], "2n");
      }
    });
  };

  return <Button onClick={() => handleClick() } colorPalette="green">Play</Button>;
}