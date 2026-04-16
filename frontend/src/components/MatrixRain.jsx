import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコサシスセソタチツテト<>{}[]()!=+-*&|^%$#@~;:/\\".split("");
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(19,7,25,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#b500ff";
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      columns = Math.floor(canvas.width / fontSize);
      if (drops.length < columns) drops.push(...Array(columns - drops.length).fill(1));

      for (let i = 0; i < columns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 55);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} id="matrix-canvas" />;
}
