// Letter stroke paths with direction indicators
// Each letter has strokes with start point, control points, and end point
// direction: 'down' | 'up' | 'left' | 'right' | 'curve-right' | 'curve-left'

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  points: StrokePoint[];
  direction: string;
}

export interface LetterPath {
  letter: string;
  strokes: Stroke[];
  width: number;
  height: number;
}

// Paths normalized to a 100x100 grid for scaling
export const letterPaths: Record<string, LetterPath> = {
  A: {
    letter: 'A',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 10, y: 90 }, { x: 50, y: 10 }], 
        direction: 'up-right' 
      },
      { 
        points: [{ x: 50, y: 10 }, { x: 90, y: 90 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 25, y: 60 }, { x: 75, y: 60 }], 
        direction: 'right' 
      },
    ],
  },
  B: {
    letter: 'B',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 60, y: 10 }, { x: 75, y: 25 }, { x: 75, y: 40 }, { x: 60, y: 50 }, { x: 20, y: 50 }], 
        direction: 'curve-right' 
      },
      { 
        points: [{ x: 20, y: 50 }, { x: 65, y: 50 }, { x: 80, y: 65 }, { x: 80, y: 80 }, { x: 65, y: 90 }, { x: 20, y: 90 }], 
        direction: 'curve-right' 
      },
    ],
  },
  C: {
    letter: 'C',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 80, y: 25 }, { x: 60, y: 10 }, { x: 30, y: 10 }, { x: 15, y: 30 }, { x: 15, y: 70 }, { x: 30, y: 90 }, { x: 60, y: 90 }, { x: 80, y: 75 }], 
        direction: 'curve-left' 
      },
    ],
  },
  D: {
    letter: 'D',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 55, y: 10 }, { x: 80, y: 30 }, { x: 80, y: 70 }, { x: 55, y: 90 }, { x: 20, y: 90 }], 
        direction: 'curve-right' 
      },
    ],
  },
  E: {
    letter: 'E',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 80, y: 10 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 20, y: 50 }, { x: 65, y: 50 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 20, y: 90 }, { x: 80, y: 90 }], 
        direction: 'right' 
      },
    ],
  },
  F: {
    letter: 'F',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 80, y: 10 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 20, y: 50 }, { x: 65, y: 50 }], 
        direction: 'right' 
      },
    ],
  },
  G: {
    letter: 'G',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 80, y: 25 }, { x: 60, y: 10 }, { x: 30, y: 10 }, { x: 15, y: 30 }, { x: 15, y: 70 }, { x: 30, y: 90 }, { x: 60, y: 90 }, { x: 80, y: 75 }, { x: 80, y: 55 }, { x: 55, y: 55 }], 
        direction: 'curve-left' 
      },
    ],
  },
  H: {
    letter: 'H',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 80, y: 10 }, { x: 80, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 50 }, { x: 80, y: 50 }], 
        direction: 'right' 
      },
    ],
  },
  I: {
    letter: 'I',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 30, y: 10 }, { x: 70, y: 10 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 50, y: 10 }, { x: 50, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 30, y: 90 }, { x: 70, y: 90 }], 
        direction: 'right' 
      },
    ],
  },
  J: {
    letter: 'J',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 30, y: 10 }, { x: 80, y: 10 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 60, y: 10 }, { x: 60, y: 70 }, { x: 50, y: 90 }, { x: 30, y: 90 }, { x: 20, y: 75 }], 
        direction: 'down' 
      },
    ],
  },
  K: {
    letter: 'K',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 80, y: 10 }, { x: 20, y: 50 }], 
        direction: 'down-left' 
      },
      { 
        points: [{ x: 35, y: 40 }, { x: 80, y: 90 }], 
        direction: 'down-right' 
      },
    ],
  },
  L: {
    letter: 'L',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 90 }, { x: 80, y: 90 }], 
        direction: 'right' 
      },
    ],
  },
  M: {
    letter: 'M',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 10, y: 90 }, { x: 10, y: 10 }], 
        direction: 'up' 
      },
      { 
        points: [{ x: 10, y: 10 }, { x: 50, y: 55 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 50, y: 55 }, { x: 90, y: 10 }], 
        direction: 'up-right' 
      },
      { 
        points: [{ x: 90, y: 10 }, { x: 90, y: 90 }], 
        direction: 'down' 
      },
    ],
  },
  N: {
    letter: 'N',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 90 }, { x: 20, y: 10 }], 
        direction: 'up' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 80, y: 90 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 80, y: 90 }, { x: 80, y: 10 }], 
        direction: 'up' 
      },
    ],
  },
  O: {
    letter: 'O',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 50, y: 10 }, { x: 20, y: 10 }, { x: 10, y: 30 }, { x: 10, y: 70 }, { x: 20, y: 90 }, { x: 80, y: 90 }, { x: 90, y: 70 }, { x: 90, y: 30 }, { x: 80, y: 10 }, { x: 50, y: 10 }], 
        direction: 'curve-left' 
      },
    ],
  },
  P: {
    letter: 'P',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 60, y: 10 }, { x: 80, y: 25 }, { x: 80, y: 45 }, { x: 60, y: 55 }, { x: 20, y: 55 }], 
        direction: 'curve-right' 
      },
    ],
  },
  Q: {
    letter: 'Q',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 50, y: 10 }, { x: 20, y: 10 }, { x: 10, y: 30 }, { x: 10, y: 65 }, { x: 20, y: 85 }, { x: 80, y: 85 }, { x: 90, y: 65 }, { x: 90, y: 30 }, { x: 80, y: 10 }, { x: 50, y: 10 }], 
        direction: 'curve-left' 
      },
      { 
        points: [{ x: 60, y: 70 }, { x: 90, y: 95 }], 
        direction: 'down-right' 
      },
    ],
  },
  R: {
    letter: 'R',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 90 }], 
        direction: 'down' 
      },
      { 
        points: [{ x: 20, y: 10 }, { x: 60, y: 10 }, { x: 80, y: 25 }, { x: 80, y: 40 }, { x: 60, y: 50 }, { x: 20, y: 50 }], 
        direction: 'curve-right' 
      },
      { 
        points: [{ x: 45, y: 50 }, { x: 85, y: 90 }], 
        direction: 'down-right' 
      },
    ],
  },
  S: {
    letter: 'S',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 75, y: 20 }, { x: 60, y: 10 }, { x: 35, y: 10 }, { x: 20, y: 25 }, { x: 20, y: 40 }, { x: 35, y: 50 }, { x: 65, y: 50 }, { x: 80, y: 60 }, { x: 80, y: 75 }, { x: 65, y: 90 }, { x: 35, y: 90 }, { x: 20, y: 80 }], 
        direction: 'curve' 
      },
    ],
  },
  T: {
    letter: 'T',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 10, y: 10 }, { x: 90, y: 10 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 50, y: 10 }, { x: 50, y: 90 }], 
        direction: 'down' 
      },
    ],
  },
  U: {
    letter: 'U',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 20, y: 10 }, { x: 20, y: 70 }, { x: 35, y: 90 }, { x: 65, y: 90 }, { x: 80, y: 70 }, { x: 80, y: 10 }], 
        direction: 'down' 
      },
    ],
  },
  V: {
    letter: 'V',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 10, y: 10 }, { x: 50, y: 90 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 50, y: 90 }, { x: 90, y: 10 }], 
        direction: 'up-right' 
      },
    ],
  },
  W: {
    letter: 'W',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 5, y: 10 }, { x: 25, y: 90 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 25, y: 90 }, { x: 50, y: 40 }], 
        direction: 'up-right' 
      },
      { 
        points: [{ x: 50, y: 40 }, { x: 75, y: 90 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 75, y: 90 }, { x: 95, y: 10 }], 
        direction: 'up-right' 
      },
    ],
  },
  X: {
    letter: 'X',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 15, y: 10 }, { x: 85, y: 90 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 85, y: 10 }, { x: 15, y: 90 }], 
        direction: 'down-left' 
      },
    ],
  },
  Y: {
    letter: 'Y',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 10, y: 10 }, { x: 50, y: 50 }], 
        direction: 'down-right' 
      },
      { 
        points: [{ x: 90, y: 10 }, { x: 50, y: 50 }], 
        direction: 'down-left' 
      },
      { 
        points: [{ x: 50, y: 50 }, { x: 50, y: 90 }], 
        direction: 'down' 
      },
    ],
  },
  Z: {
    letter: 'Z',
    width: 100,
    height: 100,
    strokes: [
      { 
        points: [{ x: 15, y: 10 }, { x: 85, y: 10 }], 
        direction: 'right' 
      },
      { 
        points: [{ x: 85, y: 10 }, { x: 15, y: 90 }], 
        direction: 'down-left' 
      },
      { 
        points: [{ x: 15, y: 90 }, { x: 85, y: 90 }], 
        direction: 'right' 
      },
    ],
  },
};

// Direction arrow data
export const directionArrows: Record<string, { angle: number; label: string }> = {
  'up': { angle: -90, label: '↑' },
  'down': { angle: 90, label: '↓' },
  'left': { angle: 180, label: '←' },
  'right': { angle: 0, label: '→' },
  'up-right': { angle: -45, label: '↗' },
  'up-left': { angle: -135, label: '↖' },
  'down-right': { angle: 45, label: '↘' },
  'down-left': { angle: 135, label: '↙' },
  'curve-right': { angle: 0, label: '⟳' },
  'curve-left': { angle: 180, label: '⟲' },
  'curve': { angle: 0, label: '∿' },
};
