const { performance } = require('perf_hooks');
const fs = require('fs');
const reportPath = './node_benchmark_results.txt';

function log(line = "") {
  fs.appendFileSync(reportPath, line + "\n");
}

function runTest(title, spec, fn) {
  log(`[TEST] ${title}`);
  log(`Purpose : ${spec.purpose}`);
  log(`Spec    : ${spec.detail}`);
  log("------------------------------------------");
  const start = performance.now();
  try {
    fn();
    const end = performance.now();
    const elapsed = ((end - start) / 1000).toFixed(4);
    log(`Result  : ${elapsed} sec`);
  } catch (err) {
    log(`Result  : ERROR - ${err.message}`);
  }
  log("");
}

fs.writeFileSync(reportPath, "========== NODE.JS V8 BENCHMARK REPORT ==========\n");
log(`Node Version  : ${process.version}`);
log("System        : Buildroot Node.js (no npm)");
log("--------------------------------------------------");
log("");

// [1] Math loop
runTest("Math Loop (sqrt)", {
  purpose: "Measure floating-point computation throughput",
  detail: "Loop 1e7 times using Math.sqrt"
}, () => {
  let x = 0;
  for (let i = 0; i < 1e7; i++) {
    x += Math.sqrt(i);
  }
});

// [2] Object allocation
runTest("Object Allocation", {
  purpose: "Stress-test garbage collection (GC)",
  detail: "Create 1 million temporary objects"
}, () => {
  let arr = [];
  for (let i = 0; i < 1e6; i++) {
    arr.push({ a: i, b: i + 1, c: i + 2 });
  }
});

// [3] JSON encode/decode
runTest("JSON Encode/Decode", {
  purpose: "Test JSON.stringify + JSON.parse performance",
  detail: "10,000 iterations on 1000-entry object"
}, () => {
  const obj = {
    id: 123,
    name: "benchmark",
    payload: Array(1000).fill("data")
  };
  for (let i = 0; i < 10000; i++) {
    JSON.parse(JSON.stringify(obj));
  }
});

// [4] String concat
runTest("String Concatenation", {
  purpose: "Measure string builder performance",
  detail: "Concatenate 'abc' 10,000 times"
}, () => {
  let s = "";
  for (let i = 0; i < 10000; i++) {
    s += "abc";
  }
});

// [5] Array ops
runTest("Array Ops (map + filter + reduce)", {
  purpose: "Test functional array operation throughput",
  detail: "map, filter, reduce on 10,000 elements"
}, () => {
  let arr = Array.from({ length: 10000 }, (_, i) => i);
  arr = arr.map(x => x * 2).filter(x => x % 3 === 0);
  const sum = arr.reduce((a, b) => a + b, 0);
});

log("========== END OF REPORT ==========");
