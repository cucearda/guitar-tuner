import React, { useEffect, useState } from "react";
import { Grid, Button, Box, GridItem } from "@chakra-ui/react";
import { Interval, intervalNameConstants } from "../models/interval";
import { IntervalQuestion } from "../models/intervalQuestion";
import PlayButton from "./PlayButton";
import { Instrument } from "../audio/instrument";

type Props = {
  selectedIntervals: string[];
  selectedOctaves: number[];
  selectedPlayOrder: string;
  instrument: Instrument | null;
};

export default function IntervalTrainerQuestion(props: Props) {
  const { selectedIntervals, selectedOctaves, selectedPlayOrder } = props;
  useEffect(() => {
    const newQuestion = new IntervalQuestion(
      Interval.createRandomInterval(
        selectedIntervals,
        selectedOctaves,
        selectedPlayOrder === "Ascending",
      ),
    );
    setQuestion(newQuestion);
    setGuessedIntervals([]);
  }, [selectedIntervals, selectedOctaves, selectedPlayOrder]);

  const [question, setQuestion] = useState<IntervalQuestion>(
    () =>
      new IntervalQuestion(
        Interval.createRandomInterval(
          selectedIntervals,
          selectedOctaves,
          selectedPlayOrder === "Ascending",
        ),
      ),
  );

  const [guessedIntervals, setGuessedIntervals] = useState<string[]>([]);
  const handleGuess = (intervalName: string) => {
    console.log("Guessed interval:", intervalName);
    question?.guessInterval(intervalName);
    setGuessedIntervals([...question.guessedIntervals]);
  };

  const handleNext = () => {
    const newQuestion = new IntervalQuestion(
      Interval.createRandomInterval(
        selectedIntervals,
        selectedOctaves,
        selectedPlayOrder === "Ascending",
      ),
    );
    setQuestion(newQuestion);
    setGuessedIntervals([]);
  }

  console.log(
    "Current question:",
    question.interval.name,
    "Guessed intervals:",
    guessedIntervals,
  );

  return (
    <Box bg="bg" borderWidth="1px" shadow="md" borderRadius="md">
      <Grid
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
        margin={10}
      >
        {intervalNameConstants.map((intervalName) => {
          if (selectedIntervals.includes(intervalName)) {
            if (question.guessedIntervals.includes(intervalName)) {
              console.log("Interval", intervalName, "was guessed");
              return (
                <Button key={intervalName} colorPalette="red">
                  {intervalName}
                </Button>
              );
            }
            if (
              question.answeredCorrectly &&
              intervalName === question.interval.name
            ) {
              return (
                <Button
                  key={intervalName}
                  colorPalette={"green"}
                  onClick={() => handleGuess(intervalName)}
                >
                  {intervalName}
                </Button>
              );
            }
            return (
              <Button
                key={intervalName}
                colorPalette={"white"}
                onClick={() => handleGuess(intervalName)}
              >
                {intervalName}
              </Button>
            );
          }
          return (
            <Button key={intervalName} disabled>
              {intervalName}
            </Button>
          );
        })}
        <GridItem colSpan={3} display="flex" justifyContent="center">
          <PlayButton
            instrument={props.instrument}
            interval={question.interval}
          />
        </GridItem>
        <GridItem colSpan={2} display="flex" justifyContent="center">
          <Button onClick={handleNext}>
            Next
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
}
