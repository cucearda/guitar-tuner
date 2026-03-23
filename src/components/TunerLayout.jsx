import { useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { TuningSelector } from "./TuningSelector";
import { FrequencyBar } from "./FrequencyBar";
import Gauge from "./Gauge";
import LiveVisualizer from "./LiveVisualizer";
import { centsDiff } from "../utils/musicUtils";
import { GUITAR_NOTES, GUITAR_NOTE_NAMES } from "../audio/note_constants/guitar_notes";

export default function TunerLayout({ frequency, analyser }) {
  const [targetHz, setTargetHz] = useState(null);
  const [minHz, setMinHz] = useState(null);
  const [maxHz, setMaxHz] = useState(null);
  const [targetNote, setTargetNote] = useState(null);

  const handleTargetChange = ({ targetHz, minHz, maxHz, targetNote }) => {
    setTargetHz(targetHz);
    setMinHz(minHz);
    setMaxHz(maxHz);
    setTargetNote(targetNote);
  };

  const hasTarget = targetHz && analyser != null;

  return (
    <HStack align="flex-start" height="100vh" gap="0">
      <TuningSelector onTargetChange={handleTargetChange} />

      {hasTarget && (
        <VStack p="4" gap="4" align="stretch" flex="1" height="100%">
          <Box p="4" borderWidth="1px" borderRadius="md" flex="1" minH="0" fill="brown" display="flex" alignItems="center" justifyContent="center" overflow="hidden"  >
            <Gauge
              cents={Math.max(-100, Math.min(100, centsDiff(targetHz, frequency)))}
              downNote={GUITAR_NOTE_NAMES[GUITAR_NOTE_NAMES.indexOf(targetNote) - 1] || ""}
              upNote={GUITAR_NOTE_NAMES[GUITAR_NOTE_NAMES.indexOf(targetNote) + 1] || ""}
              targetNote={targetNote}
            />
          </Box>

          <Box p="4" borderWidth="1px" borderRadius="md" flex="1" minH="0">
            <LiveVisualizer analyser={analyser} />
          </Box>
        </VStack>
      )}
    </HStack>
  );
}
