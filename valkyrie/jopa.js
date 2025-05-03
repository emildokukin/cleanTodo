const fs = require("fs");
const path = require("path");
const pathToTestToMaps = './testToFilesMap.json'

// const rawData = fs.readFileSync('.././coverage-reports/cssCoverage.json', "utf-8");
// const data = JSON.parse(rawData)[0];

// console.log(data.url);


// const coverageMap = {};

// // 2. Обрабатываем функции и их покрытые участки
// for (const func of data.functions) {
//     for (const range of func.ranges) {
//         const isCovered = range.count > 0;
//         for (let i = range.startOffset; i <= range.endOffset; i++) {
//             if (isCovered) {
//                 coverageMap[i] = true;
//             } else {
//                 coverageMap[i] = false;
//             }
//         }
//     }
// }


// console.log(coverageMap);



const tests = JSON.parse(fs.readFileSync(pathToTestToMaps, "utf-8"));

const alo = tests["cho s ebalom"]["http://localhost:4173/assets/index.js"].filter(el => {
    return 231251 >= el.start && 231251 <= el.end
} )

console.log(alo);
