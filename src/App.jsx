import { Stack } from "@chakra-ui/react";
import { Routes, Route, BrowserRouter} from "react-router-dom";
import IntervalTrainerLayout from "./components/IntervalTrainerLayout";
import TunerLayout from "./components/TunerLayout";

function App() {


  return (
    <Stack gap="10px" flex="1" minH="0">
      <BrowserRouter basename="/guitar-tuner">
        <Routes>
          <Route path="/" element={<TunerLayout/>} />
          <Route path="/interval-trainer" element={<IntervalTrainerLayout />} />
        </Routes>
      </BrowserRouter>
    </Stack>
  );
}


export default App
