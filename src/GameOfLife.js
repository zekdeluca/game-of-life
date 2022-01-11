export class GameOfLife {
    TITLE = "Conway's Game of Life";
    hasConcluded = false;
    rowNumber;
    columnNumber;
    state;
    intervalReferenceObject;

    constructor(rowNumber = 3, columnNumber = 3) {
        this.rowNumber = rowNumber;
        this.columnNumber = columnNumber;

        this.state = this.generateStartingState();
    }

    generateStartingState() {
        return [...new Array(this.rowNumber)].map(() => {
            return Array.from(
                {
                    length: this.columnNumber,
                },
                () => this.generateRandomCellState(),
            );
        });
    }

    generateRandomCellState() {
        return Math.floor(Math.random() * 2);
    }

    calculateNewCellState(row, column) {
        const hasLineAbove = row > 0;
        const hasLineBelow = row < this.rowNumber - 1;
        const hasLineToLeft = column > 0;
        const hasLineToRight = column < this.columnNumber - 1;

        let neighboursQuantity = 0;

        if (hasLineAbove) {
            neighboursQuantity += this.state[row - 1][column];

            if (hasLineToLeft) neighboursQuantity += this.state[row - 1][column - 1];
            if (hasLineToRight) neighboursQuantity += this.state[row - 1][column + 1];
        }
        if (hasLineToRight) {
            neighboursQuantity += this.state[row][column + 1];
        }
        if (hasLineBelow) {
            neighboursQuantity += this.state[row + 1][column];

            if (hasLineToLeft) neighboursQuantity += this.state[row + 1][column - 1];
            if (hasLineToRight) neighboursQuantity += this.state[row + 1][column + 1];
        }
        if (hasLineToLeft) {
            neighboursQuantity += this.state[row][column - 1];
        }

        if (neighboursQuantity === 2) {
            return this.state[row][column];
        } else if (neighboursQuantity === 3) {
            return 1;
        } else {
            return 0;
        }
    }

    markConcluded() {
        this.hasConcluded = true;
    }

    updateState() {
        const newState = JSON.parse(JSON.stringify(this.state));
        let stateHasChanged = false;

        for (let row = 0; row < this.rowNumber; row++) {
            for (let column = 0; column < this.columnNumber; column++) {
                const originalCellState = this.state[row][column];
                const newCellState = this.calculateNewCellState(row, column);

                if (originalCellState != newCellState) {
                    newState[row][column] = newCellState;

                    stateHasChanged = true;
                }
            }
        }

        if (stateHasChanged) {
            this.state = newState;
        } else {
            this.markConcluded();
        }
    }

    haltIfConcluded() {
        if (this.hasConcluded) clearInterval(this.intervalReferenceObject);
    }

    processTurn() {
        this.updateState();
        this.printToConsole();
        this.haltIfConcluded();
    }

    run(interval = 100) {
        if (!this.intervalReferenceObject) {
            this.intervalReferenceObject = setInterval(() => this.processTurn(), interval);
        }
    }

    generateStateRepresentation() {
        return this.state.reduce((accumulatedContent, row) => {
            const rowRepresentation = row.reduce((accumulatedRow, cell) => {
                return `${accumulatedRow}${String.fromCharCode(cell === 0 ? 0x2b1c : 0x2b1b)}`;
            }, '');

            return `${accumulatedContent}\n${rowRepresentation}`;
        }, '');
    }

    printToConsole() {
        console.clear();
        console.log(`${this.TITLE}\n${this.generateStateRepresentation()}\n`);
    }
}
