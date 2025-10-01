import { state } from "../Classes/State.js";

export let faculty = new Map();

export function generateFacultyList(){
    //populate a table with faculty name in the first column and course numbers in following columns
    faculty = new Map();
    state.courseOfferings.forEach(course => {
        let prof = course.instructor;
        if(faculty.has(prof)){
            faculty.get(prof).push(course.number);
        }
        else{
            faculty.set(prof, [course.number]);
        }
    });

    const table = document.getElementById("faculty-table");
    table.innerHTML = "";
    faculty.forEach((c, instructor) => {
        let row = document.createElement("tr");
        let prof = document.createElement("td");
        prof.innerText = instructor;
        if (instructor === "TBD"){
            row.classList.add("tbd");
        }
        row.appendChild(prof);
        c.forEach( course => {
            let cell = document.createElement("td");
            cell.innerText = course;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
}