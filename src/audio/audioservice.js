export class FrequencyStabilizer {
  constructor({ bufferSize = 8, stabilityThreshold = 15 } = {}) {
    this.bufferSize = bufferSize;
    this.stabilityThreshold = stabilityThreshold;
    this.buffer = [];
    this.lastStableFrequency = null;
  }

  process(rawFrequency) {
    if (rawFrequency === -1) {
      return -1;
    }

    this.buffer.push(rawFrequency);
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }

    if (this.buffer.length < this.bufferSize) {
      return this.lastStableFrequency ?? -1;
    }

    const sorted = [...this.buffer].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
    const allStable = this.buffer.every(
      (f) => Math.abs(1200 * Math.log2(f / median)) <= this.stabilityThreshold
    );

    if (allStable) {
      this.lastStableFrequency = median;
    }

    return this.lastStableFrequency ?? -1;
  }

  reset() {
    this.buffer = [];
    this.lastStableFrequency = null;
  }
}

class AudioService {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.frequencyCallback=null;
    this.analyzerCallback=null;
    this.stream=null;
    this.rafId=null;
    this.stabilizer = new FrequencyStabilizer();
  }
  setTargetHz(hz) {
    this.targetHz = hz;
  }
  onFrequency(setFrequency) {
    this.frequencyCallback = setFrequency;
  }
  onAnalyzer(setAnalyser) {
    this.analyzerCallback = setAnalyser;
  }
  async start() {
    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.minDecibels = -100;
    this.analyser.maxDecibels = -10;
    this.analyser.smoothingTimeConstant = 0.85;
    if (!navigator?.mediaDevices?.getUserMedia) {
      alert("Sorry, getUserMedia is required for the app.");
      return null;
    }
    try{
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = this.audioContext.createMediaStreamSource(this.stream);
      source.connect(this.analyser);

      var bufferLength = this.analyser.fftSize;
      var buffer = new Float32Array(bufferLength);

      const detect = () => {
        this.analyser.getFloatTimeDomainData(buffer);
        var autoCorrelateValue = autoCorrelate(buffer, this.audioContext.sampleRate, this.targetHz);
        this.frequencyCallback(this.stabilizer.process(autoCorrelateValue));
        console.log(`NOSTABIL ${autoCorrelateValue}`)
        console.log(`Stabilized ${this.stabilizer.process(autoCorrelateValue)}`)
        this.rafId = requestAnimationFrame(detect);
      };
      this.rafId = requestAnimationFrame(detect);
    } catch (err) {
    console.log(err);
    return null;
    }
  }

  stop() {
    this.stabilizer.reset();
    cancelAnimationFrame(this.rafId);
    this.stream?.getTracks().forEach((track) => track.stop());
    this.audioContext?.close();
    this.frequencyCallback?.(null);
  }

  resetStabilizer() {
    this.stabilizer.reset();
  }
}

// Must be called on analyser.getFloatTimeDomainData and audioContext.sampleRate
// From https://github.com/cwilso/PitchDetect/pull/23
function autoCorrelate(buffer, sampleRate, targetHz) {
  // Perform a quick root-mean-square to see if we have enough signal
  var SIZE = buffer.length;
  var sumOfSquares = 0;
  for (var i = 0; i < SIZE; i++) {
    var val = buffer[i];
    sumOfSquares += val * val;
  }
  var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
  if (rootMeanSquare < 0.005) {
    return -1;
  }

  // Find a range in the buffer where the values are below a given threshold.
  var r1 = 0;
  var r2 = SIZE - 1;
  var threshold = 0.2;

  // Walk up for r1
  for (var i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }

  // Walk down for r2
  for (var i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  // Trim the buffer to these ranges and update SIZE.
  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length;

  // Create a new array of the sums of offsets to do the autocorrelation
  var c = new Array(SIZE).fill(0);
  // For each potential offset, calculate the sum of each buffer value times its offset value
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buffer[j] * buffer[j + i];
    }
  }

  // Find the last index where that value is greater than the next one (the dip)
  var d = 0;
  while (c[d] > c[d + 1]) {
    d++;
  }

  // Iterate from that index through the end and find the maximum sum
  var maxValue = -1;
  var maxIndex = -1;
  for (var i = d; i < SIZE; i++) {
    if (c[i] > maxValue) {
      maxValue = c[i];
      maxIndex = i;
    }
  }

  var T0 = maxIndex;

  // Collect candidate frequencies: the raw peak and its sub-harmonics.
  // Pick the one closest to targetHz (if provided), otherwise prefer the
  // lowest that's strong enough (fundamental over harmonic).
  var HARMONIC_THRESHOLD = 0.85;
  var candidates = [{ lag: T0, strength: maxValue }];
  for (var mult = 2; mult <= 3; mult++) {
    var subIndex = Math.round(T0 * mult);
    if (subIndex >= SIZE) continue;
    var searchStart = Math.max(d, subIndex - 4);
    var searchEnd = Math.min(SIZE - 1, subIndex + 4);
    var bestSub = -1;
    var bestSubIndex = subIndex;
    for (var si = searchStart; si <= searchEnd; si++) {
      if (c[si] > bestSub) {
        bestSub = c[si];
        bestSubIndex = si;
      }
    }
    if (bestSub > maxValue * HARMONIC_THRESHOLD) {
      candidates.push({ lag: bestSubIndex, strength: bestSub });
    }
  }

  if (targetHz && candidates.length > 1) {
    // Pick the candidate whose frequency is closest to the target
    var bestDist = Infinity;
    for (var ci = 0; ci < candidates.length; ci++) {
      var candidateHz = sampleRate / candidates[ci].lag;
      var dist = Math.abs(candidateHz - targetHz);
      if (dist < bestDist) {
        bestDist = dist;
        T0 = candidates[ci].lag;
      }
    }
  } else if (candidates.length > 1) {
    // No target: prefer the lowest frequency (largest lag)
    T0 = candidates[candidates.length - 1].lag;
  }

  // Parabolic interpolation for precision
  var x1 = c[T0 - 1];
  var x2 = c[T0];
  var x3 = c[T0 + 1];

  var a = (x1 + x3 - 2 * x2) / 2;
  var b = (x3 - x1) / 2;
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
}

export { AudioService };
