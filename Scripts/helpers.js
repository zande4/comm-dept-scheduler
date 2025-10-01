import {courseArray} from "./parseCourses.js";
import { state } from "./Classes/State.js";
import { classrooms } from "./constantData.js";

const course_number = document.getElementById("course-num");

export function parseTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
}

export function courseNumberToObject(number){
    return courseArray.find(course => course.number === number);
}

export function daysToString(days){
    let rv = "";
    for (let day of days){
        day = day.charAt(0).toUpperCase() + day.slice(1);
        rv += (day + "/");
    }
    rv = rv.slice(0, -1);
    return rv;
}

export function daysToPatternStr(days){
        let rv = "";
        for (const d of days){
            rv += d + "-";
        }
        rv = rv.slice(0, -1);
        return rv;
    }

export function courseNumIsSpecialTopics(number){
    return(number === "89" || number === "390" || number === "490" || number === "690");
}

export function getCourseOfferingFromCid(cid){
    return state.courseOfferings.find(course => course.id == cid);
}

export function isValidCourseNumber(number){
    let rv = false;
    courseArray.forEach(course =>{
        if(number === course.number){
            rv = true;
        }
    });
    return rv;
}

export function formatInstructor(prof){
    prof = prof.toLowerCase().trim();
    if (prof === "tbd"){
        prof = prof.toUpperCase();
    }
    else{
        prof = prof.charAt(0).toUpperCase() + prof.slice(1);
    }
    return prof;
}

export function classroomString(courseOffering){
    let rv = "";
    if(courseOffering.classroom_select != ""){
        rv = classrooms.find(c => c.id === courseOffering.classroom_select).name;
    }
    if(courseOffering.classroom != ""){
        rv += ", " + courseOffering.classroom;
    }
    return rv;
}