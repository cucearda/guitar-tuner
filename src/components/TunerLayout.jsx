import { useState, useRef } from "react";
import { Box, HStack, VStack, Button, Flex } from "@chakra-ui/react";
import { TuningSelector } from "./TuningSelector";
import { FrequencyBar } from "./FrequencyBar";
import Gauge from "./Gauge";
import LiveVisualizer from "./LiveVisualizer";
import { AudioService } from "../audio/audioservice";
import {
  GUITAR_NOTES,
  GUITAR_NOTE_NAMES,
} from "../audio/note_constants/guitar_notes";

export default function TunerLayout() {
  console.log("TunerLayout rendered");
  const [targetHz, setTargetHz] = useState(null);
  const [minHz, setMinHz] = useState(null);
  const [maxHz, setMaxHz] = useState(null);
  const [targetNote, setTargetNote] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const audioServiceRef = useRef(new AudioService());

  const handleTargetChange = ({ targetHz, minHz, maxHz, targetNote }) => {
    audioServiceRef.current.resetStabilizer();
    setTargetHz(targetHz);
    setMinHz(minHz);
    setMaxHz(maxHz);
    setTargetNote(targetNote);
  };

  const handleMicrophoneStart = () => {
    if (isListening) {
      audioServiceRef.current.stop();
      setIsListening(false);
    } else {
      audioServiceRef.current.start();
      setIsListening(true);
    }
  };

  const hasTarget = targetHz != null;

  return (
    <Flex direction="column" height="100vh" overflow="hidden">
      <HStack align="flex-start" flex="1" minH="0" gap="0">
        <TuningSelector onTargetChange={handleTargetChange} />
        {hasTarget && (
          <VStack p="4" gap="4" align="stretch" flex="1" height="100%">
            <Box
              p="4"
              borderWidth="1px"
              borderRadius="md"
              flex="1"
              minH="0"
              fill="brown"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Gauge
                targetHz={targetHz}
                downNote={
                  GUITAR_NOTE_NAMES[
                    GUITAR_NOTE_NAMES.indexOf(targetNote) - 1
                  ] || ""
                }
                upNote={
                  GUITAR_NOTE_NAMES[
                    GUITAR_NOTE_NAMES.indexOf(targetNote) + 1
                  ] || ""
                }
                targetNote={targetNote}
                audioServiceRef={audioServiceRef}
              />
            </Box>

            {/* <Box p="4" borderWidth="1px" borderRadius="md" flex="1" minH="0">
            <LiveVisualizer analyser={analyser} ref={audioServiceRef} />
          </Box> */}
          </VStack>
        )}
      </HStack>
      <Button
        onClick={handleMicrophoneStart}
        background={isListening ? "green.400" : "red.400"}
      >
        {isListening ? "Stop Microphone" : "Start Microphone"}
      </Button>
    </Flex>
  );
}
