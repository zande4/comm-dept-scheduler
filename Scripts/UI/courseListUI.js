import { calendar, events } from "./calendarUI.js";
import { state } from "../Classes/State.js";
import { courseNumIsSpecialTopics, getCourseOfferingFromCid } from "../helpers.js";
import { daysToString, classroomString } from "../helpers.js";
import Timeslot from "../Classes/Timeslot.js";
import { generateChecklist } from "./checklistUI.js";
import CourseOffering from "../Classes/CourseOffering.js";
import { requirements } from "../constantData.js";
import { generateFacultyList } from "./facultyUI.js";

export function generateCourseList(){
    const course_list = document.getElementById("courses");
    let i = 0;
    for (const course of state.courseOfferings){
        let container = document.createElement("div");
        container.classList.add('course-container');
        if (i % 2 === 0){
            container.classList.add('medium-bg');
        }

        let edit_button = document.createElement("button");
        edit_button.innerText = "Edit";
        edit_button.dataset.cid = course.id;
        edit_button.addEventListener("click", handleEditCourse);

        let delete_button = document.createElement("button");
        delete_button.innerText = "Delete";
        delete_button.dataset.cid = course.id;
        delete_button.addEventListener("click", handleDeleteCourse);

        let floating_container = document.createElement("div");
        floating_container.classList.add("float-right-container");
        floating_container.appendChild(edit_button);
        floating_container.appendChild(delete_button);

        container.appendChild(floating_container);

        let title = document.createElement("b");
        title.innerText = "COMM " + course.number + " - " + course.instructor

        let row1 = document.createElement("div");
        row1.classList.add("course-row");

        let prefContainer = document.createElement("ol");
        let j = 0;
        for (const time of course.day_time){
            let time_div = document.createElement("li");
            time_div.innerText = daysToString(time.day) + " " + (time.time.toStr());
            time_div.dataset.cid = course.id;
            time_div.dataset.timeslot = j;
            time_div.addEventListener("click", handleChangeSelectedTime);
            prefContainer.appendChild(time_div);
            j++;
        }

        row1.appendChild(prefContainer);

        let row2 = document.createElement("div");
        row2.classList.add("course-row");
        let unit_div = document.createElement("div");
        unit_div.innerText = "Unit: " + course.unit;
        let recitation = document.createElement("div");
        recitation.innerText = "Recitation: " + boolToEng(course.recitation);
        let enrollment = document.createElement("div");
        enrollment.innerText = "Enrollment: " + course.enrollment;
        let crosslisted = document.createElement("div");
        crosslisted.innerText = "Crosslisted: " + course.crosslisted;
        let TAs = document.createElement("div");
        TAs.innerText = "TAs requested: " + course.numTA;
        let service = document.createElement("div");
        service.innerText = "Service component: " + boolToEng(course.service_rec);
        let year = document.createElement("div");
        year.innerText = "Year restriction: " + course.year_res;
        let major = document.createElement("div");
        major.innerText = "Major restriction: " + boolToEng(course.major_res);
        let classroom = document.createElement("div");
        classroom.innerText = "Classroom requirement: " + classroomString(course);
        row2.appendChild(unit_div);
        row2.appendChild(recitation);
        row2.appendChild(enrollment);
        row2.appendChild(crosslisted);
        row2.appendChild(TAs);
        row2.appendChild(service);
        row2.appendChild(year);
        row2.appendChild(major);
        row2.appendChild(classroom);

        container.appendChild(title);
        container.appendChild(row1);
        container.appendChild(row2);

        if(courseNumIsSpecialTopics(course.number)){
            let row3 = document.createElement("div");
            row3.classList.add("course-row");

            let name = document.createElement("div");
            name.innerText = "Title: " + course.name;
            row3.appendChild(name);

            let pathways_div = document.createElement("div");
            pathways_div.innerText = "Pathways: ";
            let pathstr = "";
                for(const p of course.pathways){
                    pathstr += (requirements.get(p)[0]) + ", ";
                }
            pathstr = pathstr.slice(0, -2);
            pathways_div.innerText += pathstr;

            row3.appendChild(pathways_div);

            let description = document.createElement("div");
            description.innerText = "Description: " + course.description;
            container.appendChild(row3);
            container.appendChild(description);
        }

        course_list.appendChild(container);

        function boolToEng(bool){
            if (bool){
                return "Yes";
            }
            else{
                return "No";
            }
        }

        i++;
    }
}

function handleEditCourse(event){
    //pass id
    let course_edit = (event.target.dataset.cid);
    sessionStorage.setItem("coursesToEdit", course_edit);
    location.href = './index.html';
}

export function handleAddCourses(){
    sessionStorage.setItem("courses", JSON.stringify(state.courseOfferings));
    location.href = "./index.html";
}

function handleChangeSelectedTime(event){
    const tar = event.target;
    const cid = tar.dataset.cid;
    const timeslotIndex = tar.dataset.timeslot;
    if(tar.closest(".medium-bg")){
        tar.classList.add("selected-light");
    }
    else{
        tar.classList.add("selected");
    }
    const siblings = [...tar.parentElement.children].filter(sib => sib !== tar);
    for (const s of siblings){
        s.classList.remove("selected");
        s.classList.remove("selected-light");
    }

    const course = getCourseOfferingFromCid(cid);
    course.selected_time = timeslotIndex;
    events.splice(0, events.length);
    for (const c of state.courseOfferings){
        c.toCalendarEvents();
    }
    calendar.setOption("events", events);
}

function handleDeleteCourse(event){
    if (!confirm("Delete course?")) return;
    state.courseOfferings.pop(getCourseOfferingFromCid(event.target.dataset.cid));
    generateChecklist();
    generateFacultyList();
    event.target.parentElement.parentElement.remove();
    events.splice(0, events.length);
    state.courseOfferings.forEach(course => {
        events.push(course.toCalendarEvents());
    });
    calendar.setOption("events", events);
}