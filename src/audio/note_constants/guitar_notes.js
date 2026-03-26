// Standard guitar range: E2 (open low E) to E6
const GUITAR_NOTES = {
  "A1": 27.50,
  "A#1": 29.14,
  "B1": 30.87,
  "C2": 32.70,
  "C#2": 34.65,
  "D2": 73.43,
  "D#2": 77.78,
  "E2":  82.41,
  "F2":  87.31,
  "F#2": 92.50,
  "G2":  98.00,
  "G#2": 103.83,
  "A2":  110.00,
  "A#2": 116.54,
  "B2":  123.47,
  "C3":  130.81,
  "C#3": 138.59,
  "D3":  146.83,
  "D#3": 155.56,
  "E3":  164.81,
  "F3":  174.61,
  "F#3": 185.00,
  "G3":  196.00,
  "G#3": 207.65,
  "A3":  220.00,
  "A#3": 233.08,
  "B3":  246.94,
  "C4":  261.63,
  "C#4": 277.18,
  "D4":  293.66,
  "D#4": 311.13,
  "E4":  329.63,
  "F4":  349.23,
  "F#4": 369.99,
  "G4":  392.00,
  "G#4": 415.30,
  "A4":  440.00,
  "A#4": 466.16,
  "B4":  493.88,
  "C5":  523.25,
  "C#5": 554.37,
  "D5":  587.33,
  "D#5": 622.25,
  "E5":  659.25,
  "F5":  698.46,
  "F#5": 739.99,
  "G5":  783.99,
  "G#5": 830.61,
  "A5":  880.00,
  "A#5": 932.33,
  "B5":  987.77,
  "C6":  1046.50,
  "C#6": 1108.73,
  "D6":  1174.66,
  "D#6": 1244.51,
  "E6":  1318.51,
};

// Strings ordered from low to high (6 to 1)
const GUITAR_TUNINGS = {
  "Standard":    ["E2", "A2", "D3", "G3", "B3", "E4"],
  "Drop D":      ["D2", "A2", "D3", "G3", "B3", "E4"],
  "Open G":      ["D2", "G2", "D3", "G3", "B3", "D4"],
  "Open D":      ["D2", "A2", "D3", "F#3", "A3", "D4"],
  "Open E":      ["E2", "B2", "E3", "G#3", "B3", "E4"],
  "Open A":      ["E2", "A2", "E3", "A3", "C#4", "E4"],
  "DADGAD":      ["D2", "A2", "D3", "G3", "A3", "D4"],
  "Half Step Down": ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
  "Full Step Down": ["D2", "G2", "C3", "F3", "A3", "D4"],
};
// Find the closest note to a given frequency
function getClosestNote(frequency) {
  let closestNote = null;
  let minDiff = Infinity;

  for (const [note, hz] of Object.entries(GUITAR_NOTES)) {
    const diff = Math.abs(frequency - hz);
    if (diff < minDiff) {
      minDiff = diff;
      closestNote = { note, hz };
    }
  }

  return closestNote;
}

const GUITAR_NOTE_NAMES = Object.keys(GUITAR_NOTES);

export { GUITAR_NOTES, GUITAR_NOTE_NAMES, GUITAR_TUNINGS, getClosestNote };
