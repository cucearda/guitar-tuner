import * as Tone from "tone";
import { Interval } from "../models/interval";

const baseUrl = "/guitar-tuner/audio/samples";

enum InstrumentType {
  // PIANO = "piano",
  CLASSIC = "guitar-nylon",
  // DRUMS = "drums",
  // BASS = "bass",
  VIOLIN = "violin"
}

class Instrument {
  private sampler: Tone.Sampler;
  
  private constructor(sampler: Tone.Sampler ) {
    this.sampler = sampler
  }

  static async create(type: InstrumentType){
    let sampler: Tone.Sampler;
    try {
      sampler = new Tone.Sampler({
        urls: {
          A3: "A3.mp3",
          A4: "A4.mp3",
          A5: "A5.mp3",
        },
        baseUrl: `${baseUrl}/${type}/`,
        onload: () => {
          console.log("INSTRUMENT LOADED");
        },
      }).toDestination();
    } catch (error) {
      console.error("Error creating instrument:", error);
      throw error;
    }
    await Tone.loaded();
    return new Instrument(sampler)
  }

  async playNote(note: string, duration: string) {
    try {
      await Tone.start();
      const value = await Tone.loaded();
      console.log("Samples loaded:", value);
      this.sampler.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error("Error playing note:", error);
    }
  }
  async playNotes(notes: string[], duration: string) {
    try {
      await Tone.start();
      await Tone.loaded();
      let i = 0
      const loop = new Tone.Loop((time) => {
        this.sampler.triggerAttackRelease(notes[i], duration);
        i += 1;
        if (i >= notes.length) {
          loop.stop();
        }
      }, duration).start(0);
      Tone.Transport.start();
    
    } catch (error) {
      console.error("Error playing interval:", error);
    }
  }
}

export {InstrumentType, Instrument };
