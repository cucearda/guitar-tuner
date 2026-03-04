import { Box } from "@chakra-ui/react";
import { BsBorderWidth } from "react-icons/bs";

function FrequencyBar({ frequency, targetFrequency, minHz, maxHz}) {
    const target_percent = Math.min(100, Math.max(0, ((targetFrequency - minHz) / (maxHz - minHz)) * 100));        
    const percent =  Math.min(100, Math.max(0, ((frequency - minHz) / (maxHz - minHz)) * 100));           
    const inTune = Math.abs(frequency - targetFrequency) < 2; // within 2Hz
    console.log(`percent:${percent}, frequency:${frequency}`)

    return (
      <Box height="200px" display="flex" alignItems="flex-end" position="relative" width="25%" margin="0 auto" borderWidth="1px" shadow="lg">
        {/* Sweet spot marker */}
        {/* Sweet spot marker */}
        <div style={{
          position: 'absolute',
          bottom: `${target_percent}%`,
          width: '100%',
          borderTop: '2px dashed green'
        }} />

        {/* Bottom line */}
        <div style={{
          position: 'absolute',
          bottom: '0%',
          width: '100%',
          borderTop: '2px solid red'
        }} />

        {/* The bar */}
        <div style={{
          width: 40,
          height: `${percent}%`,
          background: inTune ? 'green' : 'red',
          transition: 'height 0.1s ease, background 0.2s'
        }} />
      </Box>
    );
  }

export {FrequencyBar}