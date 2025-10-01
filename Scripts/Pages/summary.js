import {parseCSV} from "../parseCourses.js";
import { createEventListeners, restoreData, getCourseObjects } from "../summarySetup.js";
import { initializeSchedule } from "../UI/calendarUI.js";
import { generateChecklist } from "../UI/checklistUI.js";
import { generateFacultyList } from "../UI/facultyUI.js";
import { generateCourseList } from "../UI/courseListUI.js";
import { state } from "../Classes/State.js";
import CourseOffering from "../Classes/CourseOffering.js";

async function main(){
    const data = await parseCSV();
    createEventListeners();
    restoreData();
    getCourseObjects();
    generateChecklist();
    generateFacultyList();
    generateCourseList();
    createEventListeners();
    for (const course of state.courseOfferings){
        course.toCalendarEvents();
    }
    initializeSchedule();
}

document.addEventListener('DOMContentLoaded', main);