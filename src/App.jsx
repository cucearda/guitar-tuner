import { useState } from "react";
import { init } from "./audio/audioservice";
import { TuningSelector } from "./components/TuningSelector";
import { Stack, Button } from "@chakra-ui/react";

function App() {
  const [frequency, setFrequency] = useState(null);

  const handleClick = () => {
    init(setFrequency);
  };

  return (
    <Stack gap="10px" flex="1" minH="0">
      <Button onClick={handleClick}>Start Microphone</Button>
      <TuningSelector frequency={frequency} />
    </Stack>
  );
}


export default App
