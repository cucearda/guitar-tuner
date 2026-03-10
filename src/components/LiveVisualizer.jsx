import { useRef, useEffect } from 'react';

export default function LiveVisualizer({ analyser }) {
  const canvasRef = useRef(null);

  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      canvas.width = width;
      canvas.height = height;
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const buffer = new Uint8Array(analyser.frequencyBinCount);
    let rafId;

    const draw = () => {
      analyser.getByteTimeDomainData(buffer);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      buffer.forEach((v, i) => {
        const x = (i / buffer.length) * canvas.width;
        const y = (v / 128) * (canvas.height / 2);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [analyser]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
    </div>
  );
}
