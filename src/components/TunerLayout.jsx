import { useState } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { TuningSelector } from "./TuningSelector";
import { FrequencyBar } from "./FrequencyBar";
import Gauge from "./Gauge";
import LiveVisualizer from "./LiveVisualizer";
import { centsDiff } from "../utils/musicUtils";

export default function TunerLayout({ frequency, analyser }) {
  const [targetHz, setTargetHz] = useState(null);
  const [minHz, setMinHz] = useState(null);
  const [maxHz, setMaxHz] = useState(null);

  const handleTargetChange = ({ targetHz, minHz, maxHz }) => {
    setTargetHz(targetHz);
    setMinHz(minHz);
    setMaxHz(maxHz);
  };

  const hasTarget = targetHz && analyser != null;

  return (
    <HStack align="flex-start" height="100vh" gap="0">
      <TuningSelector onTargetChange={handleTargetChange} />

      {hasTarget && (
        <VStack p="4" gap="4" align="stretch" flex="1" height="100%">
          <Box p="4" borderWidth="1px" borderRadius="md" flex="1" minH="0">
            <FrequencyBar
              frequency={frequency}
              targetFrequency={targetHz}
              minHz={minHz}
              maxHz={maxHz}
            />
          </Box>

          <Box p="4" borderWidth="1px" borderRadius="md" flex="1" minH="0">
            <Gauge
              cents={Math.max(-100, Math.min(100, centsDiff(targetHz, frequency)))}
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
