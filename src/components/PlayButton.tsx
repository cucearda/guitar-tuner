import { Box, Button } from "@chakra-ui/react";
import {
  InstrumentFactory,
  InstrumentConfig,
  InstrumentType,
  Instrument,
} from "../audio/soundgenerator";
import { useEffect, useRef } from "react";

export default function PlayButton() {
  console.log("PlayButton rendered");
  const config = {
    type: InstrumentType.CLASSIC,
  } as InstrumentConfig;

  const instrumentRef = useRef<Instrument | null>(null);
  
  useEffect(() => {
    console.log("Instrument created");
    instrumentRef.current = InstrumentFactory.createInstrument(config, "fresh");
  }, []);

  const handleClick = async () => {
    await instrumentRef.current?.playNote("C4", "8n");
  };

  return <Button onClick={() => handleClick()}>Play</Button>;
}
