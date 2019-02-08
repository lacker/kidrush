import React, { useState } from "react";
import "./App.css";

let SIZE = 6;

// Let the ids be a bunch of possible colors
let PARTS = ["00", "55", "AA", "FF"];
let IDS = [];
for (let x of PARTS) {
  for (let y of PARTS) {
    for (let z of PARTS) {
      IDS.push("#" + x + y + z);
    }
  }
}

// Copied from SO
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Randomly selects k things from the first n elements of the list, no duplicates.
// Always returns in the same order
function select(k, n, list) {
  if (k <= 0 || n <= 0) {
    return [];
  }
  let oddsWeWantNth = k / n;
  if (Math.random() > oddsWeWantNth) {
    // We don't want the nth item on the list
    return select(k, n - 1, list);
  } else {
    // We do want the nth item on the list
    let answer = select(k - 1, n - 1, list);
    answer.push(list[n - 1]);
    return answer;
  }
}

function newGrid() {
  let numCells = SIZE * SIZE;

  // Make a list of ids where one of them is a duplicate
  let ids = select(numCells - 1, IDS.length, IDS);
  shuffle(ids);
  let duplicateID = ids[0];
  ids.push(duplicateID);
  shuffle(ids);

  let grid = [];
  for (let x = 0; x < SIZE; x++) {
    let row = [];
    for (let y = 0; y < SIZE; y++) {
      let index = x * SIZE + y;
      let id = ids[index];
      row.push({
        x: x,
        y: y,
        id: id,
        selected: false
      });
    }
    grid.push(row);
  }
  return grid;
}

export default function render() {
  let [grid, setGrid] = useState(null);
  if (grid != null) {
    return (
      <div className="App">
        <header className="App-header">
          {grid.map((row, rowIndex) => {
            return (
              <div className="Row" key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  return (
                    <div
                      className="Cell"
                      key={cellIndex}
                      style={{ backgroundColor: cell.id }}
                    />
                  );
                })}
              </div>
            );
          })}
        </header>
      </div>
    );
  }

  // Getting started screen
  return (
    <div
      className="App"
      onClick={() => {
        setGrid(newGrid());
      }}
    >
      <header className="App-header">
        <p>Find as many matches as you can before time runs out.</p>
        <p>Tap anywhere to begin!</p>
      </header>
    </div>
  );
}
