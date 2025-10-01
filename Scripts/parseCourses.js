import Course from "./Classes/Course.js";
import papaparse from 'https://cdn.jsdelivr.net/npm/papaparse@5.5.3/+esm';

export let courseArray = [];

export function parseCSV() {
    return new Promise((resolve, reject) => {
        papaparse.parse("/Scripts/courses.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            courseArray = results.data.map(row => {
                return new Course(
                    String(row.number),
                    row.name || "",
                    row.starter || false,
                    row['COMM Exp'] || false,
                    row['modes of inquiry'] || false,
                    row.representation || false,
                    row.cel || false,
                    row.mapc || false,
                    row.mtpc || false,
                    row.ocw || false,
                    row.raa || false,
                    row.newMedia || false,
                    row.prereqs || "NA",
                    row.ideas || "NA",
                    row.description || ""
                );
            });
            resolve(results.data);
            },
            error: function(error) {
                console.error("Parsing Error:", error);
                reject(err);
            }
        });
    });
}