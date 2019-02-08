import React, { useState } from "react";
import "./App.css";

let SIZE = 6;

// Let the ids be a bunch of possible colors
let PARTS = ["00", "33", "66", "99", "CC", "FF"];
let IDS = [];
for (let x of PARTS) {
  for (let y of PARTS) {
    for (let z of PARTS) {
      IDS.push("#" + x + y + z);
    }
  }
}

function newGrid() {}

export default function render() {
  let [grid, setGrid] = useState(null);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}
