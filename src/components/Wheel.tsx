import React, { useRef, useEffect, useState } from "react";
import "../styles.css";
type Direction = "clockwise" | "anticlockwise";

interface WheelProps {
  options: string[];
  direction?: Direction;
  font?: string;
  sliceColor?: string;
  textColor?: string;
  size?: number;
  onSpinEnd?: (selected: string) => void;
  playSpinAudio?: boolean;
  playCheerAudio?: boolean;
}

const Wheel: React.FC<WheelProps> = ({
  options,
  font = "Arial",
  sliceColor = "red",
  textColor = "#fff",
  size = 300,
  onSpinEnd,
  playSpinAudio = false,
  playCheerAudio = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [showCheers, setShowCheers] = useState(false);
  const spinAudioRef = useRef<HTMLAudioElement>(null);
  const cheerAudioRef = useRef<HTMLAudioElement>(null);

  const drawWheel = (ctx: CanvasRenderingContext2D) => {
    const radius = size / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    const isDefault = options.length === 0;
    const displayOptions = isDefault
      ? Array.from({ length: 8 }, (_, i) => `Option ${i + 1}`)
      : options;

    const sliceAngle = (2 * Math.PI) / displayOptions.length;

    ctx.clearRect(0, 0, size, size);

    displayOptions.forEach((option, index) => {
      // Start from top (12 o'clock position) and go clockwise
      const startAngle = index * sliceAngle - Math.PI / 2;
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternate colors
      ctx.fillStyle = index % 2 === 0 ? "red" : "white";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      if (!isDefault) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.font = `bold 14px ${font}`;
        ctx.fillStyle = index % 2 === 0 ? textColor : "black";

        // Wrap long text
        const maxWidth = radius - 20;
        const words = option.split(" ");
        let line = "";
        let y = 0;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, radius - 10, y);
            line = words[n] + " ";
            y += 16;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, radius - 10, y);

        ctx.restore();
      }
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(angle);
    ctx.translate(-size / 2, -size / 2);
    drawWheel(ctx);
    ctx.restore();
  }, [angle, options, font, sliceColor, textColor, size]);

  const spin = async () => {
    if (spinning || options.length === 0) return;

    if (playSpinAudio && spinAudioRef.current) {
      try {
        spinAudioRef.current.currentTime = 0;
        await spinAudioRef.current.play();
      } catch (error) {
        console.warn("Could not play spin audio:", error);
      }
    }

    setSpinning(true);
    const extraSpin = 360 * 5; // 5 full rotations
    const sliceAngle = 360 / options.length;
    const randomSlice = Math.floor(Math.random() * options.length);

    // Calculate final angle to land on the selected slice
    // We want the slice to be at the top (0 degrees relative to our pointer)
    const targetAngle = randomSlice * sliceAngle;
    const finalDeg = extraSpin + targetAngle;

    const duration = 3000;
    const startTime = performance.now();

    const animate = async (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentDeg = easeOut * finalDeg;
      const radians = (currentDeg * Math.PI) / 180;
      setAngle(radians);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setSpinning(false);

        if (playSpinAudio && spinAudioRef.current) {
          try {
            spinAudioRef.current.pause();
            spinAudioRef.current.currentTime = 0;
          } catch (error) {
            console.warn("Error stopping spin audio:", error);
          }
        }

        if (playCheerAudio && cheerAudioRef.current) {
          try {
            cheerAudioRef.current.currentTime = 0;
            await cheerAudioRef.current.play();
          } catch (error) {
            console.warn("Could not play cheer audio:", error);
          }
        }

        // Calculate which slice is at the top (pointer position)
        const normalizedAngle = ((currentDeg % 360) + 360) % 360;
        const sliceIndex =
          Math.floor((360 - normalizedAngle) / sliceAngle) % options.length;
        const selectedOption = options[sliceIndex];

        setSelected(selectedOption);
        setShowDialog(true); // Show dialog instead of just setting selected

        if (onSpinEnd) {
          onSpinEnd(selectedOption);
        }
      }
    };

    requestAnimationFrame(animate);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setShowCheers(false);

    // Hide cheers animation after 3 seconds
    setTimeout(() => {
      setShowCheers(false);
    }, 3000);
  };

  return (
    <div className="wheel-container">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="wheel-canvas"
      />

      {/* Pointer/Indicator */}
      <div className="wheel-pointer">
        <svg
          fill="#000000"
          width="35px"
          height="35px"
          viewBox="0 0 24 24"
          id="down-alt"
          data-name="Flat Color"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            id="primary"
            d="M21.21,12.88l-1.84-2.46A2,2,0,0,0,16.66,10L16,10.4V4.27a2,2,0,0,0-2-2H10a2,2,0,0,0-2,2V10.4L7.34,10a2,2,0,0,0-2.71.46L2.79,12.88a2,2,0,0,0,.37,2.78l7.61,5.92a2,2,0,0,0,2.46,0l7.61-5.92A2,2,0,0,0,21.21,12.88Z"
          ></path>
        </svg>
      </div>

      <button onClick={spin} disabled={spinning} className="spin-button">
        {spinning ? "Spinning..." : "Spin the Wheel!"}
      </button>

      <audio
        ref={spinAudioRef}
        preload="auto"
        onError={() => console.error("Error loading spin audio")}
      >
        <source
          src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
          type="audio/wav"
        />
        <source src="/spin.mp3" type="audio/mpeg" />
        <source src="/spin.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      <audio
        ref={cheerAudioRef}
        preload="auto"
        onError={() => console.error("Error loading cheer audio")}
      >
        <source
          src="https://www.soundjay.com/misc/sounds/beep-28.wav"
          type="audio/wav"
        />
        <source src="/cheer.mp3" type="audio/mpeg" />
        <source src="/cheer.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>

      {/* Winner Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <div className="dialog-emoji">🎉</div>
            <h2 className="dialog-title">Winner!</h2>
            <div className="dialog-winner">{selected}</div>
            <button onClick={closeDialog} className="dialog-button">
              Awesome! 🎊
            </button>
          </div>
        </div>
      )}

      {selected && !showDialog && !showCheers && (
        <div className="last-winner">
          <div className="last-winner-text">🎉 Last Winner: {selected} 🎉</div>
        </div>
      )}
    </div>
  );
};

export default Wheel;
