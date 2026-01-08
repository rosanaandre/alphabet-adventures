import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { letterPaths, directionArrows, Stroke } from '@/data/letterPaths';

interface LetterCanvasProps {
  letter: string;
  onComplete: () => void;
  size?: number;
}

export const LetterCanvas: React.FC<LetterCanvasProps> = ({
  letter,
  onComplete,
  size = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(0);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const [strokeComplete, setStrokeComplete] = useState<boolean[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const letterData = letterPaths[letter];
  const scale = size / 100;

  // Draw the guide letter and strokes
  const drawGuide = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !letterData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background
    ctx.fillStyle = '#FFF9E6';
    ctx.fillRect(0, 0, size, size);

    // Draw completed strokes in green
    strokeComplete.forEach((complete, index) => {
      if (complete && letterData.strokes[index]) {
        drawStroke(ctx, letterData.strokes[index], '#22C55E', 12);
      }
    });

    // Draw remaining strokes in light gray (guide)
    letterData.strokes.forEach((stroke, index) => {
      if (!strokeComplete[index]) {
        drawStroke(ctx, stroke, '#E5E7EB', 16);
      }
    });

    // Draw current stroke guide in primary color with dashes
    if (currentStroke < letterData.strokes.length && !strokeComplete[currentStroke]) {
      const stroke = letterData.strokes[currentStroke];
      drawStroke(ctx, stroke, '#3B82F6', 8, true);
      
      // Draw start point
      const startPoint = stroke.points[0];
      ctx.beginPath();
      ctx.arc(startPoint.x * scale, startPoint.y * scale, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#22C55E';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw arrow at start
      const direction = directionArrows[stroke.direction];
      if (direction) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(direction.label, startPoint.x * scale, startPoint.y * scale);
      }

      // Draw end point
      const endPoint = stroke.points[stroke.points.length - 1];
      ctx.beginPath();
      ctx.arc(endPoint.x * scale, endPoint.y * scale, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw user's current drawing
    if (drawnPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      for (let i = 1; i < drawnPoints.length; i++) {
        ctx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
      }
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [letterData, strokeComplete, currentStroke, drawnPoints, scale, size]);

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke,
    color: string,
    lineWidth: number,
    dashed: boolean = false
  ) => {
    const points = stroke.points;
    if (points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(points[0].x * scale, points[0].y * scale);

    if (points.length === 2) {
      ctx.lineTo(points[1].x * scale, points[1].y * scale);
    } else {
      // Draw smooth curve through points
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(
          points[i].x * scale,
          points[i].y * scale,
          xc * scale,
          yc * scale
        );
      }
      // Last point
      const last = points[points.length - 1];
      const secondLast = points[points.length - 2];
      ctx.quadraticCurveTo(
        secondLast.x * scale,
        secondLast.y * scale,
        last.x * scale,
        last.y * scale
      );
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (dashed) {
      ctx.setLineDash([10, 10]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    drawGuide();
  }, [drawGuide]);

  useEffect(() => {
    // Reset when letter changes
    setCurrentStroke(0);
    setDrawnPoints([]);
    setStrokeComplete(new Array(letterPaths[letter]?.strokes.length || 0).fill(false));
    setShowSuccess(false);
  }, [letter]);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const checkStrokeCompletion = () => {
    if (!letterData || currentStroke >= letterData.strokes.length) return false;

    const stroke = letterData.strokes[currentStroke];
    const startPoint = stroke.points[0];
    const endPoint = stroke.points[stroke.points.length - 1];

    if (drawnPoints.length < 5) return false;

    const firstDrawn = drawnPoints[0];
    const lastDrawn = drawnPoints[drawnPoints.length - 1];

    // Check if started near start point
    const startDist = Math.sqrt(
      Math.pow(firstDrawn.x - startPoint.x * scale, 2) +
      Math.pow(firstDrawn.y - startPoint.y * scale, 2)
    );

    // Check if ended near end point
    const endDist = Math.sqrt(
      Math.pow(lastDrawn.x - endPoint.x * scale, 2) +
      Math.pow(lastDrawn.y - endPoint.y * scale, 2)
    );

    const threshold = 40;
    return startDist < threshold && endDist < threshold;
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setDrawnPoints([coords]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    setDrawnPoints(prev => [...prev, coords]);
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (checkStrokeCompletion()) {
      // Mark current stroke as complete
      const newComplete = [...strokeComplete];
      newComplete[currentStroke] = true;
      setStrokeComplete(newComplete);

      // Play success sound
      playSuccessSound();

      // Move to next stroke or complete letter
      if (currentStroke + 1 >= letterData.strokes.length) {
        // All strokes complete!
        setShowSuccess(true);
        playVictorySound();
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setCurrentStroke(currentStroke + 1);
      }
    }

    setDrawnPoints([]);
  };

  const playSuccessSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const playVictorySound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.15);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);

      oscillator.start(audioContext.currentTime + i * 0.15);
      oscillator.stop(audioContext.currentTime + i * 0.15 + 0.3);
    });
  };

  const resetCanvas = () => {
    setCurrentStroke(0);
    setDrawnPoints([]);
    setStrokeComplete(new Array(letterData?.strokes.length || 0).fill(false));
    setShowSuccess(false);
  };

  if (!letterData) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-muted-foreground">Letra não disponível</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-3xl border-4 border-border shadow-card touch-none cursor-crosshair"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Instructions */}
      <div className="absolute -bottom-16 left-0 right-0 text-center">
        <p className="text-sm text-muted-foreground">
          {currentStroke < letterData.strokes.length
            ? `Traço ${currentStroke + 1} de ${letterData.strokes.length} - Siga do ponto verde ao vermelho`
            : 'Parabéns! Letra completa!'}
        </p>
      </div>

      {/* Reset button */}
      <button
        onClick={resetCanvas}
        className="absolute -top-3 -right-3 w-10 h-10 bg-destructive text-destructive-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        ↺
      </button>

      {/* Success overlay */}
      {showSuccess && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-success/90 rounded-3xl"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="text-8xl">🎉</span>
            <p className="text-2xl font-bold text-success-foreground mt-2">
              Muito bem!
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
