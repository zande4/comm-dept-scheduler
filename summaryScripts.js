let courseOfferings = [];
let courseObjects = [];
let sortedCourses = new Map();
let faculty = new Map();
let calendar;
let events = [];
let resources = [];
const units = ["Rhetoric", "Interpersonal and Organizational Communication", "Performance Studies", "Media and Technology Studies", "Media Arts"];
const pathways = {cel: "Communication and Everyday Life", mapc: "Media Arts, Performance, and Critical Practice",
    mtpc: "Media Technologies and Public Culture", ocw: "Organization, Communication, and Work", raa: "Rhetoric, Activism, and Advocacy",
moi: "Modes of Inquiry", rid: "Representation, Identity, and Difference"};
const WEEK = "2025-08-0";
const DAYS = {sun: "3", mon: "4", tues: "5", wed: "6", thur: "7", fri: "8", sat: "9"};
const dropdown = document.getElementById("filter-select");
const checklist_section = document.getElementById("checklists");
const requirements = new Map([["FY_SEMINAR", ["First-year Seminar Courses", 1]], ["COMMBEYOND", ["Communication Beyond Carolina", 5]],
    ["starter",["Starter Courses", 2]], ["m", ["Modes of Inquiry", 1]], ["r", ["Representation, Identity, and Difference", 1]],
    ["lower", ["Lower Level Courses", 2]], ["upper", ["Upper Level Courses", 4]], ["cel", ["Communication and Everyday Life", 1]],
    ["mapc", ["Media Arts, Performance, and Critical Practice", 1]], ["mtpc", ["Media Technologies and Public Culture", 1]],
    ["ocw", ["Organization, Communication, and Work", 1]], ["raa", ["Rhetoric, Activism, and Advocacy", 1]], ["h", ["COMM Experience", 1]]]);

document.addEventListener('DOMContentLoaded', () => {
    parseCSV(() => {
        showOutput();
    });
});

class Course{
    constructor(number, name, starter, h, m, r, cel, mapc, mtpc, ocw, raa, newMedia, prereqs, ideas, description){
        this.number = number;
        this.name = name;
        this.starter = starter;
        this.h = h;
        this.m = m;
        this.r = r;
        this.mapc = mapc;
        this.cel = cel;
        this.ocw = ocw;
        this.raa = raa;
        this.mtpc = mtpc;
        this.newMedia = newMedia;
        this.prereqs = prereqs;
        this.ideas = ideas;
        this.description = description;
    }
}        

function showOutput(){
    restoreData();
    getCourseObjects();
    generateChecklist();
    generateFacultyList();
    generateCourseList();
    createEventListeners();
    courseOfferings.forEach(course => {
        parseCoursesToEvents(course);
    });
    initializeSchedule();
}

function restoreData(){
    courseOfferings = JSON.parse(localStorage.getItem('courses'));
}

function createEventListeners(){
    const radios = document.querySelectorAll("input[type='radio'");
    radios.forEach(radio =>{
        radio.addEventListener("change", handleFilterSelect);
    })
    dropdown.addEventListener("change", handleDropdownSelect);
    document.getElementById("clear-filter-button").addEventListener("click", handleClearFilter);
    document.getElementById("summary").addEventListener("click", generateDocument);
    document.getElementById("export").addEventListener("click", exportData);
}

function getCourseObjects(){
    courseArray.forEach(course => {
        let offered = false;
        courseOfferings.forEach(offering => {
            if (course.number === offering.number){
                offered = true;
            }
        });
        if(offered){
            courseObjects.push(course);
        }
    });
}

function generateChecklist(){
    courseOfferings.forEach(course => {
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
    let seats = document.createElement("div");
    let num_seats = 0;
    sortedCourses.get(unit).forEach(course => {
        if (course.enrollment){
            num_seats += Number(course.enrollment);
        }
    });
    seats.innerHTML = `&nbsp; &nbsp; Total Seats ` + num_seats + "/100";
    if (num_seats > 100){
        seats.classList.add("satisfied");
    }
    parent.appendChild(seats);

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

function generateFacultyList(){
    //populate a table with faculty name in the first column and course numbers in following columns
    faculty = new Map();
    courseOfferings.forEach(course => {
        let prof = course.instructor.toLowerCase().trim();
        if (prof === "tbd"){
            prof = prof.toUpperCase();
        }
        else{
            prof = prof.charAt(0).toUpperCase() + prof.slice(1);
        }
        if(faculty.has(prof)){
            faculty.get(prof).push(course.number);
        }
        else{
            faculty.set(prof, [course.number]);
        }
    });

    const table = document.getElementById("faculty-table");
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

function generateCourseList(){
    const course_list = document.getElementById("courses");
    let i = 0;
    for (const course of courseOfferings){
        let container = document.createElement("div");
        container.classList.add('course-container');

        let edit_button = document.createElement("button");
        edit_button.innerText = "Edit"
        edit_button.classList.add("float-right-button");
        edit_button.dataset.cid = course.id;
        edit_button.addEventListener("click", handleEditCourse);
        container.appendChild(edit_button);

        let title = document.createElement("b");
        title.innerText = "COMM " + course.number + " - " + course.instructor

        let row1 = document.createElement("div");
        row1.classList.add("course-row");

        let prefContainer = document.createElement("ol");
        for (const time of course.day_time){
            let time_div = document.createElement("li");
            time_div.innerText = daysToString(time.day) + " " + timeslotToString(time.time);
            prefContainer.appendChild(time_div);
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
        classroom.innerText = "Classroom requirement: " + course.classroom_select + ", " + course.classroom;
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
            for ( const path of course.pathways){
                pathways_div.innerText += pathways[path] + "; ";
            }
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

function timeslotToString(timeslot){
    let [hour, minute] = timeslot.start.split(':').map(Number);
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const startStr = `${hour}:${minute.toString().padStart(2, '0')}${ampm}`;
    [hour, minute] = timeslot.end.split(':').map(Number);
    ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    const endStr =  `${hour}:${minute.toString().padStart(2, '0')}${ampm}`;
    return startStr + " - " + endStr;
}

function daysToString(days){
    let rv = "";
    for (let day of days){
        day = day.charAt(0).toUpperCase() + day.slice(1);
        rv += (day + "/");
    }
    rv = rv.slice(0, -1);
    return rv;
}

function courseNumIsSpecialTopics(number){
    return(number === "89" || number === "390" || number === "490" || number === "690");
}

function parseCoursesToEvents(course){
    //adds an object(s) of the format {title: "", start: "", end: ""} for a given course offering to a global event array
    let rv = {title: "", start: "", end: "", resourceIds: [course.instructor]};
    let reqs = getCourseReqs(courseNumberToObject(course.number));
    reqs.forEach(req  => {
        rv.resourceIds.push(req);
    });
    rv.resourceIds.push(course.unit);
    rv.title = "COMM " + course.number + " " + course.instructor;
    
    let daysofweek = [];
    for (const day of course.day_time[0].day){
        if (!(course.recitation && day === "fri")){
            daysofweek.push(DAYS[day]);   
        }
    }
    let timestart = course.day_time[0].time.start;
    let timeend = course.day_time[0].time.end;
    
    daysofweek.forEach(day => {
        rv.start = WEEK + day + " " + timestart;
        rv.end = WEEK + day + " " + timeend;
        events.push({...rv});
    });
}

function courseNumberToObject(number){
    return courseArray.find(course => course.number === number);
}

function getCourseReqs(course){
    let rv = [];
    for (const req of requirements.keys()){
        if ((req === "COMMBEYOND" || req === "FY_SEMINAR") && course.ideas.includes(req)){
            rv.push(req);
        }
        else if (req === "lower" && course.number < 400){
            rv.push(req);
        }
        else if (req === "upper" && course.number >= 400){
            rv.push(req);
        }
        else if (course[req] === true){
            rv.push(req);
        }
    }
    return rv;
}

function handleEditCourse(event){
    //pass id
    let course_edit = JSON.stringify(courseOfferings.find(course => course.id === event.target.dataset.cid));
    localStorage.setItem("coursesToEdit", course_edit);
    location.href = './index.html';
}

function initializeSchedule(){
    const schedule = document.getElementById("schedule");
    calendar = new EventCalendar(schedule, {
    plugins: [ EventCalendar.TimeGrid, EventCalendar.Interaction ],
    customButtons: {
        edit: {
            text: "Edit Schedule",
            click: function() {
                calendar.setOption("eventStartEditable", true);
            }
        }
    },
    view: 'timeGridWeek',
    resources: resources,
    eventStartEditable: false,
    eventDurationEditable: false,
    headerToolbar: {start: "", center: "", end:"edit"},
    dayHeaderFormat: { weekday: 'short' },
    date: "2025-08-03",
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    slotEventOverlap: false,
    allDaySlot: false,
    events: events
    });
}

function handleFilterSelect(event){
    const target = event.target;
    if (target.name === 'cal-filter' && target.type === 'radio') {
        dropdown.replaceChildren();
        switch (target.value){
            case "requirement":
                for (const req of requirements.keys()){
                    const opt = document.createElement("option");
                    opt.value = req;
                    opt.innerText = requirements.get(req)[0];
                    dropdown.appendChild(opt);
                }
                break;
            case "instructor":
                for (const prof of faculty.keys()){
                    const opt = document.createElement("option");
                    opt.value = prof;
                    opt.innerText = prof;
                    dropdown.appendChild(opt);
                }
                break;
            case "unit":
                for (const unit of units){
                    const opt = document.createElement("option");
                    opt.value = unit;
                    opt.innerText = unit;
                    dropdown.appendChild(opt);
                }
                break;
        }
    }
}

function handleDropdownSelect(){
    let resourceId = dropdown.value;
    let filteredEvents = [];
    events.forEach(event => {
        if (event.resourceIds.includes(resourceId)){
            filteredEvents.push(event);
        }
    });
    calendar.setOption('events', filteredEvents);
}

function handleClearFilter(){
    calendar.setOption('events', events);
}

function generateDocument(){
    let header = document.createElement("p");
    let iframe = document.getElementById("print-content");
    header.innerText = "test";
    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
        <html>
        <head>
            <title>Summary Download</title>
        </head>
        <body>
            <h1>Course Offering Submission</h1>
        </body>
        </html>`);
    doc.close();
    
        doc.body.appendChild(header);
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

}

function exportData(){
    const blob = new Blob([JSON.stringify(courseOfferings)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course-offering-export.json";
    a.click();
}