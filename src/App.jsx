import { useState, useRef } from "react";
import { init } from "./audio/audioservice";
import TunerLayout from "./components/TunerLayout";
import { Stack, Button } from "@chakra-ui/react";

function App() {
  const [frequency, setFrequency] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [analyser, setAnalyser] = useState(null)
  const stopRef = useRef(null);

  const handleClick = async () => {
    if (isListening) {
      stopRef.currentStopFunction?.();
      stopRef.currentStopFunction = null;
      setIsListening(false);
    } else {
      const stop = await init(setFrequency, setAnalyser);
      if (stop) {
        stopRef.currentStopFunction = stop;
        setIsListening(true);
      }
    }
  };

  return (
    <Stack gap="10px" flex="1" minH="0">
      <Button onClick={handleClick} background={isListening ? "green.400" : "red.400"} >
        {isListening ? "Stop Microphone" : "Start Microphone"}
      </Button>
      <TunerLayout frequency={frequency} analyser={analyser} />
    </Stack>
  );
}


export default App
