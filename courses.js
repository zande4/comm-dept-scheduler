let courseArray = [];

function parseCSV(callback) {
    Papa.parse("courses.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            courseArray = results.data.map(row => {
        
                return new Course(
                    String(row.number),
                    row.name,
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
                    row.description
                );
            });
            if (callback) callback();
        },
        error: function(error) {
            console.error("Parsing Error:", error);
        }
    });
}