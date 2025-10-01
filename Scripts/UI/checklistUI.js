import { state } from "../Classes/State.js";
import { requirements } from "../constantData.js";
import { courseNumIsSpecialTopics, courseNumberToObject } from "../helpers.js";

let sortedCourses = new Map();
const checklist_section = document.getElementById("checklists");

export function generateChecklist(){
    checklist_section.innerHTML = "";
    sortedCourses.clear();
    state.courseOfferings.forEach(course => {
        if(sortedCourses.has(course.unit)){
            sortedCourses.get(course.unit).push(course);
        }
        else{
            sortedCourses.set(course.unit, [course]);
        }
    });

    for (const unit of sortedCourses.keys()){
        generateUnitChecklist(unit);
    }
}

function generateUnitChecklist(unit){
    let heading = document.createElement("h3");
    heading.innerText = unit;
    let parent = document.createElement("div");

    for (const field of requirements.keys()){
        let details = document.createElement("details");
        let summary = document.createElement("summary");
        let courses = getSatisfyingCourses(field, unit);
        let span = document.createElement("span");
        span.innerText = courses.length;
        let p = document.createElement("p");
        courses.forEach(course => {
            p.innerText += "COMM" + course.number + " ";
        });
        if (courses.length >= requirements.get(field)[1]){
            summary.classList.add("satisfied");
        }
        summary.innerText = requirements.get(field)[0] + " ";
        summary.appendChild(span);
        summary.innerText += ("/" + requirements.get(field)[1]);
        details.appendChild(summary);
        details.appendChild(p);
        parent.appendChild(details);
    }
    checklist_section.appendChild(heading);
    checklist_section.appendChild(parent);
}

function getSatisfyingCourses(criterion, unit){
    let satisfying_courses = [];
    let courses = sortedCourses.get(unit);
    if (criterion === "FY-SEMINAR" || criterion === "COMMBEYOND"){
        courses.forEach(course => {
            if (courseNumberToObject(course.number).ideas.includes(criterion)){
                satisfying_courses.push(course);
            }
        });
    }
    else if (criterion === "lower" || criterion === "upper"){
        courses.forEach(course => {
            if(criterion === "lower" && course.number < 400){
                satisfying_courses.push(course);
            }
            else if (criterion === "upper" && course.number >= 400){
                satisfying_courses.push(course);
            }
        });
    }
    else{
        for (const course of courses){
            if (courseNumIsSpecialTopics(course.number)){
                if (course.pathways.includes(criterion)){
                    satisfying_courses.push(course);
                }
                else{
                    continue;
                }
            }
            else if (courseNumberToObject(course.number)[criterion] === true){
                satisfying_courses.push(course);
            }
        }
    }
    return satisfying_courses;
}