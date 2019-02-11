import React, { useState } from "react";
import "./App.css";

import leo1 from "./leo1.png";
import leo2 from "./leo2.png";
import kevin1 from "./kevin1.png";
import grandma1 from "./grandma1.png";
import grandpa1 from "./grandpa1.png";

let SIZE = 4;
let TIME = 45;
let CELL = 150;
if (window.innerWidth < 700) {
  CELL = 50;
}

// Let the ids be a bunch of possible colors
let PARTS = ["00", "AA", "FF"];
let IDS = [leo1, leo2, kevin1, grandma1, grandpa1];
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
      let data = {
        x: x,
        y: y,
        id: id,
        selected: false
      };
      if (id[0] === "#") {
        data.color = id;
      } else {
        data.pic = id;
      }
      row.push(data);
    }
    grid.push(row);
  }
  return grid;
}

function deselect(grid) {
  return grid.map(row =>
    row.map(cell => {
      return { ...cell, selected: false };
    })
  );
}

function getSelectedID(grid) {
  for (let row of grid) {
    for (let cell of row) {
      if (cell.selected) {
        return cell.id;
      }
    }
  }
  return null;
}

function stringDisplay(s) {
  return (
    <div className="Spacer">
      <div className="Spacer">
        <p>{s}</p>
      </div>
      <div className="Spacer" />
      <div className="Spacer" />
      <div className="Spacer" />
    </div>
  );
}

function onCellClick(
  cell,
  grid,
  setGrid,
  score,
  setScore,
  pausing,
  setPausing
) {
  // Deselecting
  if (cell.selected) {
    cell.selected = false;
    setGrid(deselect(grid));
    return;
  }

  // Selecting
  let current = getSelectedID(grid);
  if (current !== cell.id) {
    let newGrid = deselect(grid);
    newGrid[cell.x][cell.y].selected = true;
    setGrid(newGrid);
    return;
  }

  // Winning
  setScore(score + 1);
  setGrid(newGrid());
}

export default function render() {
  let [grid, setGrid] = useState(null);
  let [score, setScore] = useState(null);
  let [time, setTime] = useState(null);
  let [pausing, setPausing] = useState(false);

  if (grid != null) {
    setTimeout(() => {
      if (time > 1) {
        setTime(time - 1);
      } else {
        // Time up
        setPausing(true);
        setGrid(null);
        setTimeout(() => {
          setPausing(false);
        }, 1000);
      }
    }, 1000);

    return (
      <div className="App">
        {stringDisplay(score)}
        <div className="Game">
          {grid.map((row, rowIndex) => {
            return (
              <div className="Row" key={rowIndex}>
                {row.map((cell, cellIndex) => {
                  let style = {
                    borderColor: cell.selected ? "#FFFFFF" : "#000000",
                    height: CELL + "px",
                    width: CELL + "px"
                  };
                  if (cell.color) {
                    style.backgroundColor = cell.color;
                  }
                  return (
                    <div
                      className="Cell"
                      key={cellIndex}
                      style={style}
                      onClick={() =>
                        onCellClick(cell, grid, setGrid, score, setScore)
                      }
                    >
                      {cell.pic ? (
                        <img
                          src={cell.pic}
                          height={CELL}
                          width={CELL}
                          alt="pic"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {stringDisplay(time)}
      </div>
    );
  }

  // Getting started screen
  return (
    <div
      className="App"
      onClick={() => {
        if (pausing) {
          return;
        }
        setScore(0);
        setTime(TIME);
        setGrid(newGrid());
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        {score === null ? (
          <p>Welcome to KIDRUSH</p>
        ) : (
          <p>Your score was {score}.</p>
        )}
        <p>Find as many matches as you can before time runs out.</p>
        <p>Tap anywhere to begin!</p>
      </header>
    </div>
  );
}
