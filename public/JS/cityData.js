let right = 0;
let up = Math.PI/2;

// Streets
// REMINDER: Objects are centered to their relative center
let streetCoords = {
    1: {
      start: [-250, 0.2, -200],
      dir: 'h',
      angle: right,
      nR: 6,
      nB: 6.
    },
    2: {
      start: [-200, 0.2, -250],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 6.
    },
    3: {
      start: [-100, 0.2, -250],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 6.
    },
    4: {
      start: [0, 0.2, -250],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 2.
    },
    5: {
      start: [0, 0.2, 150],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 2.
    },
    6: {
      start: [100, 0.2, -250],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 2.
    },
    7: {
      start: [100, 0.2, 150],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 2.
    },
    8: {
      start: [200, 0.2, -250],
      dir: 'v',
      angle: up,
      nR: 1,
      nB: 6.
    },
}

export {
    streetCoords as default
}