const { exec } = require("child_process");
const fs = require("fs");


const TEST_NAME = "cho s ebalom";

exec(`npx playwright test -g "${TEST_NAME}"`, (error, stdout, stderr) => {
    if (error) {
        console.log(`ERROR WHILE EXECUTING TEST: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);

    makeTestToFilesMap();
});


function makeTestToFilesMap() {

    const rawData = fs.readFileSync('./valkyrie/testToFilesMap.json', "utf-8");
    const testToFilesMap = JSON.parse(rawData);


    const coverageRow = fs.readFileSync('./coverage-reports/coverage-report.json');
    const coverageJS = JSON.parse(coverageRow);

    testToFilesMap[TEST_NAME] = {};


    const currentTest = testToFilesMap[TEST_NAME];

    for (const file of coverageJS) {

        const url = file.url;

        if (!currentTest[url]) {
            currentTest[url] = [];
        }

        const isCssFile = !file.functions;

        if (isCssFile) {
            // currentTest[url] = file.ranges.map(el => ({ start: el.start + 1, end: el.end - 1 }));
            currentTest[url] = file.ranges;
            continue;
        }

        const ranges = [];
        // const functions = file.functions.filter(el => el.isBlockCoverage);

        for (const func of file.functions) {
            for (const range of func.ranges) {
                ranges.push({ start: range.startOffset, end: range.endOffset, isCovered: range.count > 0 });
            }
        }

        function mergeIntervals(intervals) {
            if (!intervals.length) return [];

            // Сортируем интервалы по началу
            intervals.sort((a, b) => a.start - b.start);

            const merged = [intervals[0]];

            for (let i = 1; i < intervals.length; i++) {
                const last = merged[merged.length - 1];
                const current = intervals[i];

                if (current.start <= last.end) {
                    // Объединяем, если интервалы перекрываются
                    last.end = Math.max(last.end, current.end);
                } else {
                    // Иначе добавляем новый интервал
                    merged.push(current);
                }
            }

            return merged;
        }

        const uncoveredIntervals = ranges.filter(int => !int.isCovered);
        const mergedSortedIntervals = mergeIntervals(uncoveredIntervals);


        // ranges.sort((a, b) => a.startOffset - b.startOffset)

        console.log('mergedSortedIntervals', mergedSortedIntervals);

        const wholeInterval = ranges[0];


        if (!wholeInterval.isCovered) {
            continue;
        }

        for (let i = 0; i < mergedSortedIntervals.length; i++) {
            const curUncov = mergedSortedIntervals[i];
            const prevUncov = mergedSortedIntervals[i - 1];

            if (i === 0) {
                if (wholeInterval.start !== curUncov.start) {
                    currentTest[url].push({ start: wholeInterval.start, end: curUncov.end - 1 })
                }
                continue;
            }

            if (i === mergedSortedIntervals.length - 1) {
                if (wholeInterval.end !== curUncov.end) {
                    currentTest[url].push({ start: curUncov.end + 1, end: wholeInterval.end })
                }
                continue;
            }

            currentTest[url].push({ start: prevUncov.end + 1, end: curUncov.start - 1 })

        }


        // for (const range of ranges) {

        //     if (currentTest[url].length && range.end < currentTest[url].at(-1).startOffset) {
        //         continue;
        //     }

        //     if (range.count > 0) {

        //         if (currentTest[url].length) {
        //             const lastRange = currentTest[url].at(-1);
        //             const isLastRangeCovered = lastRange.isCovered;
        //             // 1
        //             if (isLastRangeCovered) {
        //                 if (range.startOffset <= lastRange.end) {
        //                     lastRange.end = Math.max(range.endOffset, lastRange.end);
        //                 } else {
        //                     currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: true })
        //                 }
        //                 // 2
        //             } else {

        //                 if (range.startOffset >= lastRange.start && range.endOffset <= lastRange.end) {
        //                     continue;
        //                 }

        //                 if (range.startOffset > lastRange.end) {
        //                     currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: true })
        //                 } else {
        //                     currentTest[url].push({ start: lastRange.end + 1, end: range.endOffset, isCovered: true })
        //                 }


        //             }

        //             // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //             //     console.log('11111');

        //             //     console.log(lastRange, range);
        //             // }

        //         } else {
        //             currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: true })
        //             // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //             //     console.log('22222');
        //             //     console.log(lastRange, range);
        //             // }
        //         }
        //     } else {
        //         if (currentTest[url].length) {
        //             const lastRange = currentTest[url].at(-1);
        //             const isLastRangeCovered = lastRange.isCovered;

        //             // 3
        //             if (isLastRangeCovered) {
        //                 if (range.startOffset === 303 && currentTest[url].at(-1) && 230906 >= currentTest[url].at(-1).start && 230906 <= currentTest[url].at(-1).end) {
        //                     console.log(currentTest[url].at(-1), range);

        //                 }
        //                 if (range.startOffset >= lastRange.start && range.endOffset <= lastRange.end) {
        //                     const eend = lastRange.end;
        //                     lastRange.end = range.startOffset - 1;

        //                     currentTest[url].push({ start: range.endOffset + 1, end: eend, isCovered: true })


        //                     // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //                     //     console.log('3333', kakaha);

        //                     //     console.log(kakaha, range);
        //                     // }
        //                     continue;
        //                 }

        //                 if (range.startOffset > lastRange.end) {
        //                     currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: false })
        //                     // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //                     //     console.log('44444444');

        //                     //     console.log(lastRange, range);
        //                     // }
        //                     continue;
        //                 }

        //                 if (lastRange.start > range.endOffset) {
        //                     currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: false })
        //                     // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //                     //     console.log('44444444');

        //                     //     console.log(lastRange, range);
        //                     // }
        //                     continue;
        //                 }

        //                 lastRange.end = range.startOffset - 1;
        //                 // 4
        //             } else {
        //                 if (range.startOffset <= lastRange.end) {
        //                     lastRange.end = Math.max(range.endOffset, lastRange.end);
        //                 } else {
        //                     currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: false })
        //                 }
        //                 // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //                 //     console.log('55555');

        //                 //     console.log(lastRange, range);
        //                 // }
        //             }

        //         } else {
        //             currentTest[url].push({ start: range.startOffset, end: range.endOffset, isCovered: false })
        //             // if (currentTest[url].at(-1).start === 170413 && currentTest[url].at(-1).end === 170293) {
        //             //     console.log('6666666');

        //             //     console.log(lastRange, range);
        //             // }
        //         }
        //     }
        // }

        // currentTest[url] = currentTest[url].filter(el => el.isCovered);

        // const alo = currentTest[url].some((el, i, arr) => {

        //     return 230906 >= el.start && 230906 <= el.end
        // })

        // console.log('alo', alo);


        // for (const func of functions) {
        //     const start = func.ranges[0].startOffset;
        //     const end = func.ranges[0].endOffset;

        //     if (func.ranges.length === 1) {
        //         if (func.ranges[0].isBlockCoverage) {
        //             currentTest[url].push({ start: curStart, end: end })
        //         }
        //         continue;
        //     }

        //     let curStart = start;

        //     for (let i = 1; i < func.ranges.length; i++) {
        //         const range = func.ranges[i];

        //         if (range.count > 0) {
        //             continue;
        //         }

        //         currentTest[url].push({ start: curStart, end: range.startOffset - 1 })
        //         curStart = range.endOffset + 1;
        //     }

        //     currentTest[url].push({ start: curStart, end: end })
        // }


    }


    fs.writeFileSync('./valkyrie/testToFilesMap.json', JSON.stringify(testToFilesMap));

}
