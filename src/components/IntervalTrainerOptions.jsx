import { useState } from "react";
import { Button, HStack, VStack, Text } from "@chakra-ui/react";
import { intervalNameConstants } from "../models/interval";

const OCTAVES = [1, 2, 3, 4, 5, 6, 7];
const PLAY_ORDERS = ["Ascending", "Descending"];

export default function IntervalTrainerOptions({ selectedIntervals, selectedOctaves, selectedPlayOrder, setSelectedIntervals, setSelectedOctaves, setSelectedPlayOrder }) {
  const [openPanel, setOpenPanel] = useState(null); // "intervals" | "octaves" | "playOrder" | null

  // Draft selections (local to each panel, committed on Save)
  const [draftIntervals, setDraftIntervals] = useState([...intervalNameConstants]);
  const [draftOctaves, setDraftOctaves] = useState([3, 4]);
  const [draftPlayOrder, setDraftPlayOrder] = useState("Ascending");



  const handleOpen = (panel) => {
    if (openPanel === panel) {
      setOpenPanel(null);
      return;
    }
    // Reset drafts to current committed state when opening
    if (panel === "intervals") setDraftIntervals([...selectedIntervals]);
    if (panel === "octaves") setDraftOctaves([...selectedOctaves]);
    if (panel === "playOrder") setDraftPlayOrder(selectedPlayOrder);
    setOpenPanel(panel);
  };

  const handleSave = () => {
    if (openPanel === "intervals") setSelectedIntervals(draftIntervals);
    if (openPanel === "octaves") setSelectedOctaves(draftOctaves);
    if (openPanel === "playOrder") setSelectedPlayOrder(draftPlayOrder);
    setOpenPanel(null);
  };

  const toggleDraftInterval = (interval) => {
    setDraftIntervals((prev) =>
      prev.includes(interval)
        ? prev.filter((i) => i !== interval)
        : [...prev, interval]
    );
  };

  const toggleDraftOctave = (octave) => {
    setDraftOctaves((prev) =>
      prev.includes(octave)
        ? prev.filter((o) => o !== octave)
        : [...prev, octave]
    );
  };

  return (
    <HStack align="flex-start" height="100%">
      {/* Left nav — option categories */}
      <VStack
        p="4"
        borderRightWidth="1px"
        height="100%"
        align="stretch"
        minW="160px"
      >
        <Button
          variant={openPanel === "intervals" ? "solid" : "outline"}
          onClick={() => handleOpen("intervals")}
        >
          Intervals
        </Button>
        <Button
          variant={openPanel === "octaves" ? "solid" : "outline"}
          onClick={() => handleOpen("octaves")}
        >
          Octaves
        </Button>
        <Button
          variant={openPanel === "playOrder" ? "solid" : "outline"}
          onClick={() => handleOpen("playOrder")}
        >
          Play Order
        </Button>
      </VStack>

      {/* Intervals panel */}
      {openPanel === "intervals" && (
        <VStack
          p="4"
          borderRightWidth="1px"
          height="100%"
          align="stretch"
          minW="180px"
          overflowY="auto"
        >
          <Text fontWeight="bold" mb="2">Intervals</Text>
          {intervalNameConstants.map((interval) => (
            <Button
              key={interval}
              variant={draftIntervals.includes(interval) ? "solid" : "outline"}
              onClick={() => toggleDraftInterval(interval)}
            >
              {interval}
            </Button>
          ))}
          <Button variant="solid" mt="2" onClick={handleSave}>
            Save
          </Button>
        </VStack>
      )}

      {/* Octaves panel */}
      {openPanel === "octaves" && (
        <VStack
          p="4"
          borderRightWidth="1px"
          height="100%"
          align="stretch"
          minW="180px"
        >
          <Text fontWeight="bold" mb="2">Octaves</Text>
          {OCTAVES.map((octave) => (
            <Button
              key={octave}
              variant={draftOctaves.includes(octave) ? "solid" : "outline"}
              onClick={() => toggleDraftOctave(octave)}
            >
              {octave}
            </Button>
          ))}
          <Button variant="solid" mt="2" onClick={handleSave}>
            Save
          </Button>
        </VStack>
      )}

      {/* Play Order panel */}
      {openPanel === "playOrder" && (
        <VStack
          p="4"
          borderRightWidth="1px"
          height="100%"
          align="stretch"
          minW="180px"
        >
          <Text fontWeight="bold" mb="2">Play Order</Text>
          {PLAY_ORDERS.map((order) => (
            <Button
              key={order}
              variant={draftPlayOrder === order ? "solid" : "outline"}
              onClick={() => setDraftPlayOrder(order)}
            >
              {order}
            </Button>
          ))}
          <Button variant="solid" mt="2" onClick={handleSave}>
            Save
          </Button>
        </VStack>
      )}
    </HStack>
  );
}
