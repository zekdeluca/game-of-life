import { GameOfLife } from './src/GameOfLife.js';

const processingArgs = process.argv.slice(2);
const boardDimensions = processingArgs.length ? [Number(processingArgs[0]), Number(processingArgs[1])] : [7, 7];

const gameOfLife = new GameOfLife(...boardDimensions);
gameOfLife.run();
