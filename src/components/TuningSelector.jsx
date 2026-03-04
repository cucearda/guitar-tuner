import { useState } from "react";
import { Box, Button, HStack, VStack, Text, DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerHeader, DrawerRoot, DrawerTitle } from "@chakra-ui/react";
import {
  GUITAR_TUNINGS,
  GUITAR_NOTES,
  GUITAR_NOTE_NAMES,
} from "../note_constants/guitar_notes";
import { FrequencyBar } from "./FrequencyBar";

function TuningSelector({ frequency }) {
  const [selectedTuning, setSelectedTuning] = useState(null);
  const [selectedString, setSelectedString] = useState(null);
  const [editCustomTuning, setEditCustomTuning] = useState(true)
  const [customTuning, setCustomTuning] = useState(GUITAR_TUNINGS.Standard)
  const [editingStringIndex, setEditingStringIndex] = useState(null);
  const handleTuningSelect = (tuning) => {
    setSelectedTuning(tuning);
    setSelectedString(null);
  };

  const targetNote =
    selectedTuning !== null && selectedString !== null
      ? selectedTuning === "Custom"
        ? customTuning[selectedString]
        : GUITAR_TUNINGS[selectedTuning][selectedString]
      : null;

  const targetHz = targetNote ? GUITAR_NOTES[targetNote] : null;
  const noteIndex = targetNote ? GUITAR_NOTE_NAMES.indexOf(targetNote) : -1;
  const minHz =
    noteIndex >= 2 ? GUITAR_NOTES[GUITAR_NOTE_NAMES[noteIndex - 2]] : null;
  const maxHz =
    noteIndex !== -1 && noteIndex + 2 < GUITAR_NOTE_NAMES.length
      ? GUITAR_NOTES[GUITAR_NOTE_NAMES[noteIndex + 2]]
      : null;

  const handleCustomString = (index) => {
    if (editCustomTuning) {
      setEditingStringIndex(index);
    } else {
      setSelectedString(index);
    }
  };

  return (
    <HStack align="flex-start" height="100vh">
      {/* Left nav — tuning list */}
      <VStack
        p="4"
        borderRightWidth="1px"
        height="100%"
        align="stretch"
        minW="160px"
      >
        {Object.keys(GUITAR_TUNINGS).map((tuning) => (
          <Button
            key={tuning}
            variant={selectedTuning === tuning ? "solid" : "outline"}
            onClick={() => handleTuningSelect(tuning)}
          >
            {tuning}
          </Button>
        ))}
        <Button
          key={"Custom"}
          variant={selectedTuning === "Custom" ? "solid" : "outline"}
          onClick={() => handleTuningSelect("Custom")}
        >
          Custom
        </Button>
      </VStack>

      {/* String panel — opens inline when a tuning is selected */}
      {selectedTuning && selectedTuning !== "Custom" && (
        <VStack
          p="4"
          borderRightWidth="1px"
          height="100%"
          align="stretch"
          minW="180px"
        >
          <Text fontWeight="bold" mb="2">
            {selectedTuning}
          </Text>
          {GUITAR_TUNINGS[selectedTuning].map((note, index) => (
            <Button
              key={index}
              variant={selectedString === index ? "solid" : "outline"}
              onClick={() => setSelectedString(index)}
            >
              String {6 - index} — {note}
            </Button>
          ))}
        </VStack>
      )}
      {/* Special panel for Custom Tuning*/}
      {selectedTuning === "Custom" && (
        <VStack
          p="4"
          borderRightWidth="1px"
          height="100%"
          align="stretch"
          minW="180px"
        >
          <Text fontWeight="bold" mb="2">
            Custom
          </Text>
          <Button
            variant={editCustomTuning ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => {
              setEditCustomTuning((prev) => !prev);
              setEditingStringIndex(null);
              setSelectedString(null);
            }}
          >
            {editCustomTuning ? "Done Editing" : "Edit Tuning"}
          </Button>
          {customTuning.map((note, index) => (
            <Button
              key={index}
              variant={
                editCustomTuning
                  ? editingStringIndex === index ? "solid" : "outline"
                  : selectedString === index ? "solid" : "outline"
              }
              onClick={() => handleCustomString(index)}
            >
              String {6 - index} — {note}
            </Button>
          ))}
        </VStack>
      )}

      {/* FrequencyBar — shows when a string is selected */}
      {targetHz && (
        <FrequencyBar
          frequency={frequency}
          targetFrequency={targetHz}
          minHz={minHz}
          maxHz={maxHz}
        />
      )}
      <DrawerRoot
        open={editingStringIndex !== null}
        onOpenChange={(details) => {
          if (!details.open) setEditingStringIndex(null);
        }}
        placement="end"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              Select note for String {editingStringIndex !== null ? 6 - editingStringIndex : ""}
            </DrawerTitle>
          </DrawerHeader>
          <DrawerCloseTrigger />
          <DrawerBody overflowY="auto">
            <VStack align="stretch">
              {GUITAR_NOTE_NAMES.map((note) => (
                <Button
                  key={note}
                  variant={
                    editingStringIndex !== null &&
                    customTuning[editingStringIndex] === note
                      ? "solid"
                      : "outline"
                  }
                  onClick={() => {
                    setCustomTuning((prev) => {
                      const next = [...prev];
                      next[editingStringIndex] = note;
                      return next;
                    });
                    setEditingStringIndex(null);
                  }}
                >
                  {note}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </HStack>
  );
}

export { TuningSelector };
