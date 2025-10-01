import papaparse from 'https://cdn.jsdelivr.net/npm/papaparse@5.5.3/+esm';
import { state } from "./Classes/State.js";
import Timeslot from './Classes/Timeslot.js';
import { daysToString, classroomString } from './helpers.js';
import { requirements } from './constantData.js';

export function exportData(){
    const blob = new Blob([JSON.stringify(state.courseOfferings)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course-offering-export.json";
    a.click();
}

export function exportPDF(){
    
}

export function generateDocument(){
    let iframe = document.getElementById("print-content");
    let clone = document.getElementById("courses").cloneNode(true);
    let cal = document.getElementById("schedule").cloneNode(true);
    clone.querySelectorAll("button").forEach(btn => btn.remove());
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
        <html>
        <head>
            <title>Summary Download</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@event-calendar/build@4.3.0/dist/event-calendar.min.css">
            <style>
                body{
                    margin: 30px;
                }
                .course-container{
                    padding: 20px;
                }
                .ec-event{
                    color: black;
                    border: solid, 1px, black;
                }
            </style>
        </head>
        <body>
            <h1>Course Offering Submission</h1>
        </body>
        </html>`);
    doc.close();
    doc.body.appendChild(clone);
    doc.body.appendChild(cal);
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
}

export function exportCSV(){
    const data = [];
    for (const row of state.courseOfferings){
        const timestr = [];
        for(const t of row.day_time){
            timestr.push(daysToString(t.day) + " " + (t.time.toStr()));
        };
        let pathstr = "";
        for(const p of row.pathways){
            pathstr += (requirements.get(p)[0]) + ", ";
        }
        pathstr = pathstr.slice(0, -2);

        data.push({
            Unit: row.unit,
            Number: row.number,
            Instructor: row.instructor,
            "Time 1": timestr[0],
            "Time 2": timestr[1],
            "Time 3": timestr[2],
            "Max Enrollment": row.enrollment,
            "Crosslisted Department": row.crosslisted,
            "Number TAs Requested": row.numTAs,
            Recitation: (row.recitation === "on"),
            "Service Requirement":  (row.service_req === "on"),
            "Year Restriction": row.year_res,
            "Major Restriction": (row.major_res === "on"),
            Classroom: classroomString(row),
            "Active Learning Classroom": (row.active_learning === "on"),
            Name: row.name,
            Description: row.description,
            Pathways: pathstr
        });
    }

    const csv = papaparse.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "course-offering-spreadsheet.csv";
    a.click();
}