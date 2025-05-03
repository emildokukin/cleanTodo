const { exec } = require("child_process");
const fs = require("fs");

const diff = require('diff');

const pathToOriginalBuild = './dist'
const pathToTestToMaps = './testToFilesMap.json'

// exec(`cd ..; npx vite build --outDir ${pathToOriginalBuild}`, (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

const originalFiles = fs.readdirSync('./originalBuild/assets');
const changedFiles = fs.readdirSync('../dist/assets');

const changes = {}


for (const fileName of originalFiles) {
    // console.log('fileName', fileName);

    // if (fileName === 'assets') {
    //     continue;
    // }
    const originalFile = fs.readFileSync(`./originalBuild/assets/${fileName}`, "utf-8");
    const changedFile = fs.readFileSync(`../dist/assets/${fileName}`, "utf-8");

    const differences = diff.diffChars(originalFile, changedFile);

    // console.log(differences.filter(el => el.added || el.removed));


    let oldIndex = 0;
    let newIndex = 0;
    let index = 0;
    const intervals = [];

    differences.forEach(change => {
        const length = change.value.length;
        if (change.added) {
            intervals.push({
                type: 'added',
                newStart: newIndex,
                newEnd: newIndex + length,
                index: index
            });
            newIndex += length;
        } else if (change.removed) {
            intervals.push({
                type: 'removed',
                oldStart: oldIndex,
                oldEnd: oldIndex + length,
                index: index
            });
            oldIndex += length;
        } else {
            oldIndex += length;
            newIndex += length;
            index += length;
        }
    });

    if (fileName.includes('css')) {
        console.log(fileName, intervals);
    }

    changes[fileName] = intervals;
}

// console.log('changes', changes);



const tests = JSON.parse(fs.readFileSync(pathToTestToMaps, "utf-8"));

// console.log('EBLOOOO', tests['cho s ebalom']['http://localhost:4173/assets/index-BP3UKQsh.js'])

const affectedTests = [];

for (const test in tests) {
    const testAffectedFiles = tests[test];
    let isTestAffected = false;

    alo: for (const file in testAffectedFiles) {
        // console.log('file', file);

        const validUrl = file.split('/').pop();

        const currentChanges = changes[validUrl];

        // console.log('currentChanges', currentChanges);

        const testAffectedIntervals = testAffectedFiles[file];

        for (const testAffectedInterval of testAffectedIntervals) {

            for (const currentChange in currentChanges) {
                const change = currentChanges[currentChange];

                if (change.type === 'added') {
                    if (change.index > testAffectedInterval.end || change.index < testAffectedInterval.start) {
                        continue;
                    }

                    console.log('file:', file);

                    console.log(1, 'testAffectedInterval:', testAffectedInterval, 'change:', change);


                    isTestAffected = true;
                    break alo;


                } else if (change.type === 'removed') {
                    if (change.index > testAffectedInterval.end || change.index < testAffectedInterval.start) {
                        continue;
                    }

                    console.log('file:', file);

                    console.log(1, 'testAffec111tedInterval:', testAffectedInterval, 'change:', change);

                    isTestAffected = true;
                    break alo;
                }


            }
        }

    }

    if (isTestAffected) {
        affectedTests.push(test)
    }
}


console.log(affectedTests);


// const originalFile = fs.readFileSync('./dist/assets/index-BP3UKQsh.js', "utf-8");
// const changedFile = fs.readFileSync('../dist/assets/index-BP3UKQsh.js', "utf-8");

// console.log(changes);

// console.log(JSON.stringify(changedCharIndexes));
// console.log(intervals);




// const originalFiles = fs.readFileSync('./valkyrie/testToFilesMap.json', "utf-8");
// const testToFilesMap = JSON.parse(rawData);




// fs.writeFileSync('./valkyrie/testToFilesMap.json', JSON.stringify(testToFilesMap));
