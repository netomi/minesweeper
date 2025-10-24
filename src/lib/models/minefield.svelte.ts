import { SvelteSet } from 'svelte/reactivity';
import { getRandomInt } from '$lib/utils';

export class MineFieldModel {
  readonly rows: number;
  readonly cols: number;

  private readonly tiles: boolean[];
  private bombs: SvelteSet<number> = new SvelteSet();
  private flags: SvelteSet<number> = new SvelteSet();

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;

    this.tiles = $state(Array(this.size).fill(false));
  }

  initBombs(amount: number) {
    this.bombs = new SvelteSet();

    const lastIndex = this.size - 1;
    while (this.bombs.size < amount) {
      const index = getRandomInt(0, lastIndex);
      this.bombs.add(index);
    }

    this.flags.clear();
  }

  reset() {
    for (const i in this.tiles) {
      this.tiles[i] = false;
    }

    this.initBombs(this.bombs.size);
  }

  get size() {
    return this.rows * this.cols;
  }

  get rowIndices() {
    return Array(this.rows).keys();
  }

  get colIndices() {
    return Array(this.cols).keys();
  }

  getCellIndex(row: number, col: number) {
    return col + row * this.cols;
  }

  getCoordinates(index: number) {
    const row = Math.floor(index / this.cols);
    const col = index % this.cols;

    return [row, col];
  }

  isOpen(index: number) {
    return this.tiles[index];
  }

  open(index: number) {
    this.tiles[index] = true;

    if (this.hasBomb(index)) {
      for (const i of this.bombs) {
        this.tiles[i] = true;
      }
      return;
    }

    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const indicesToCheck = new Set(this.getNeighbors(index));
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const indicesAlreadyChecked = new Set();

    while (indicesToCheck.size > 0) {
      const i = indicesToCheck.values().next().value;
      if (i !== undefined) {
        indicesToCheck.delete(i);
        indicesAlreadyChecked.add(i);

        if (!this.hasBomb(i)) {
          if (this.getBombsInVicinity(i) == 0) {
            for (const j of this.getNeighbors(i)) {
              if (!indicesAlreadyChecked.has(j)) {
                indicesToCheck.add(j);
              }
            }
          }
          this.tiles[i] = true;
        }
      }
    }
  }

  flag(index: number) {
    this.flags.add(index);
  }

  hasFlag(index: number) {
    return this.flags.has(index);
  }

  hasBomb(index: number) {
    return this.bombs.has(index);
  }

  getNeighbors(index: number) {
    const [row, col] = this.getCoordinates(index);

    const neighbors: number[] = [];

    this.addNeighbor(row - 1, col - 1, neighbors);
    this.addNeighbor(row - 1, col, neighbors);
    this.addNeighbor(row - 1, col + 1, neighbors);

    this.addNeighbor(row, col - 1, neighbors);
    this.addNeighbor(row, col + 1, neighbors);

    this.addNeighbor(row + 1, col - 1, neighbors);
    this.addNeighbor(row + 1, col, neighbors);
    this.addNeighbor(row + 1, col + 1, neighbors);

    return neighbors;
  }

  private addNeighbor(row: number, col: number, neighbors: number[]) {
    if (row < 0 || row >= this.rows) {
      return;
    }

    if (col < 0 || col >= this.cols) {
      return;
    }

    neighbors.push(this.getCellIndex(row, col));
  }

  getBombsInVicinity(index: number) {
    let bombs = 0;
    for (const j of this.getNeighbors(index)) {
      if (this.hasBomb(j)) {
        bombs += 1;
      }
    }
    return bombs;
  }

  get lost() {
    for (const i of this.bombs) {
      if (this.isOpen(i)) {
        return true;
      }
    }
    return false;
  }
}
