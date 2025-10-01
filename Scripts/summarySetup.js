import { courseArray } from "./parseCourses.js";
import { exportCSV, exportData, generateDocument, exportPDF } from "./export.js";
import { handleColorCodeToggle, handleFilterSelect, handleClearFilter, handleDropdownSelect } from "./UI/calendarUI.js";
import {state} from "./Classes/State.js";
import { handleAddCourses } from "./UI/courseListUI.js";

export function createEventListeners(){
    const radios = document.querySelectorAll("input[type='radio'");
    radios.forEach(radio =>{
        radio.addEventListener("change", handleFilterSelect);
    })
    document.getElementById("filter-select").addEventListener("change", handleDropdownSelect);
    document.getElementById("clear-filter-button").addEventListener("click", handleClearFilter);
    document.getElementById("summary").addEventListener("click", generateDocument);
    document.getElementById("export").addEventListener("click", exportData);
    document.getElementById("add-courses").addEventListener("click", handleAddCourses);
    document.getElementById("csv").addEventListener("click", exportCSV);

    const color_toggle = document.getElementById("color-toggle");
    color_toggle.addEventListener("change", handleColorCodeToggle);
}

export function getCourseObjects(){
    let rv = [];
    courseArray.forEach(course => {
        let offered = false;
        state.courseOfferings.forEach(offering => {
            if (course.number === offering.number){
                offered = true;
            }
        });
        if(offered){
            rv.push(course);
        }
    });
    return rv;
}

export function restoreData(){
    state.restoreSessionData();
}