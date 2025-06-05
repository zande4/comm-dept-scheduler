let courseOfferings = [];
let courseObjects = [];
let sortedCourses = new Map();
let faculty = new Map();
let calendar;
let events = [];
let resources = [];
const units = ["Rhetoric", "Interpersonal and Organizational Communication", "Performance Studies", "Media and Technology Studies", "Media Arts"];
const dayStr = new Map([["monwedfri", "Mon/Wed/Fri"], ["monwed", "Mon/Wed"], ["tuesthur", "Tues/Thur"], ["mon", "Mon"]]);
const timeStr = new Map([["1", "8:00am - 8:50am"], ["2", "8:00am - 9:15am"], ["3", "9:05am - 9:55am"], ["4", "9:05am - 10:20am"], ["5", "9:30am - 10:45am"], ["6", "10:10am - 11:00am"],
["7", "10:10am - 11:25am"], ["8", "11:00am - 12:15pm"], ["9","11:15am - 12:05pm"],
["10", "11:15am - 12:30pm"], ["11", "12:20pm - 1:10pm"], ["12", "12:20pm - 1:35pm"], ["13", "12:30pm - 1:45pm"],
["14", "1:25pm - 2:15pm"], ["15", "1:25pm - 2:40pm"], ["16", "2:00pm - 3:15pm"], ["17", "3:30pm - 4:45pm"],
["18", "5:00pm - 6:15pm"], ["19", "5:45pm - 6:35pm"], ["20", "5:45pm - 7:00pm"]]);
const pathways = {cel: "Communication and Everyday Life", mapc: "Media Arts, Performance, and Critical Practice",
    mtpc: "Media Technologies and Public Culture", ocw: "Organization, Communication, and Work", raa: "Rhetoric, Activism, and Advocacy"};
const WEEK = "2025-08-0";
const DAYS = {sun: "3", mon: "4", tue: "5", wed: "6", thur: "7", fri: "8", sat: "9"};
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
        courses.forEach(course => {
            if (courseNumberToObject(course.number)[criterion] === true){
                satisfying_courses.push(course);
            }
        });
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
    for (const course of courseOfferings){
        let container = document.createElement("div");
        let title = document.createElement("b");
        title.innerText = "COMM " + course.number + " - " + course.instructor
        let text = document.createElement("ul");

        if(typeof(course.name) === 'string' && course.name.length != 0){
            let name = document.createElement("li");
            name.innerText = "Title: " + course.name;
            text.appendChild(name);
            let description = document.createElement("p");
            description.innerText = "Description: " + course.description;
            text.appendChild(description);
        }

        if(courseNumIsSpecialTopics(course.number)){
            let pathwaysli = document.createElement("li");
            pathwaysli.innerText = "Pathways: ";
            const paths = Object.keys(pathways);
            for (let i = 0; i < paths.length; i++){
                if (course.pathways[i]){
                    pathwaysli.innerText += pathways[paths[i]] + "; ";
                }
            }
            text.appendChild(pathwaysli);
        }

        let time = document.createElement("li");
        time.innerText = dayStr.get(course.day) + " " + timeStr.get(course.time);
        let enrollment = document.createElement("li");
        enrollment.innerText = "Enrollment: " + course.enrollment;
        let crosslisted = document.createElement("li");
        crosslisted.innerText = "Crosslisted: " + course.crosslisted;
        let TAs = document.createElement("li");
        TAs.innerText = "TAs requested: " + course.numTA;
        let service = document.createElement("li");
        service.innerText = "Service component: " + boolToEng(course.service_rec);
        let year = document.createElement("li");
        year.innerText = "Year restriction: " + course.year_res;
        let major = document.createElement("li");
        major.innerText = "Major restriction: " + boolToEng(course.major_res);
        let classroom = document.createElement("li");
        classroom.innerText = "Classroom requirement: " + course.classroom;


        text.appendChild(time);
        text.appendChild(enrollment);
        text.appendChild(crosslisted);
        text.appendChild(TAs);
        text.appendChild(service);
        text.appendChild(year);
        text.appendChild(major);
        text.appendChild(classroom);
        container.appendChild(title);
        container.appendChild(text);

        course_list.appendChild(container);

        function boolToEng(bool){
            if (bool){
                return "Yes";
            }
            else{
                return "No";
            }
        }
    }
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
    switch (course.day){
        case "monwedfri":
            daysofweek.push(DAYS.mon);
            daysofweek.push(DAYS.wed);
            if (!course.recitation){
                daysofweek.push(DAYS.fri);
            }
            break;
        case "monwed":
            daysofweek.push(DAYS.mon);
            daysofweek.push(DAYS.wed);
            break;
        case "tuesthur":
            daysofweek.push(DAYS.tue);
            daysofweek.push(DAYS.thur);
            break;
        case "mon":
            daysofweek.push(DAYS.mon);
            break;
    }
    let timestart = "";
    let timeend = "";
    switch (course.time){
        case "1":
            timestart = "08:00";
            timeend = "08:50";
            break;
        case "2":
            timestart = "08:00";
            timeend = "09:15";
            break;
        case "3":
            timestart = "09:05";
            timeend = "09:55";
            break;
        case "4":
            timestart = "09:05";
            timeend = "10:20";
            break;
        case "5":
            timestart = "09:30";
            timeend = "10:45";
            break;
        case "6":
            timestart = "10:10";
            timeend = "11:00";
            break;
        case "7":
            timestart = "10:10";
            timeend = "11:25";
            break;
        case "8":
            timestart = "11:00";
            timeend = "12:15";
            break;
        case "9":
            timestart = "11:15";
            timeend = "12:05";
            break;
        case "10":
            timestart = "011:15";
            timeend = "12:30";
            break;
        case "11":
            timestart = "12:20";
            timeend = "13:10";
            break;
        case "12":
            timestart = "12:20";
            timeend = "13:35";
            break;
        case "13":
            timestart = "12:30";
            timeend = "13:45";
            break;
        case "14":
            timestart = "13:25";
            timeend = "14:15";
            break;
        case "15":
            timestart = "13:25";
            timeend = "14:40";
            break;
        case "16":
            timestart = "14:00";
            timeend = "15:15";
            break;
        case "17":
            timestart = "15:30";
            timeend = "16:45";
            break;
        case "18":
            timestart = "17:00";
            timeend = "18:15";
            break;
        case "19":
            timestart = "17:45";
            timeend = "18:35";
            break;
        case "20":
            timestart = "17:45";
            timeend = "19:00";
            break;
        case "21":
            timestart = "14:45";
            timeend = "17:25";
        case "22":
            timestart = "17:45"
            timeend = "20:25";
    }
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
    if (course.cel){
        rv.push("cel");
    }
    if (course.mapc){
        rv.push("mapc");
    }
    if (course.mtpc){
        rv.push("mtpc");
    }
    if (course.ocw){
        rv.push("ocw");
    }
    if (course.raa){
        rv.push("raa");
    }
    if (course.m){
        rv.push("moi");
    }
    if (course.r){
        rv.push("rid");
    }
    return rv;
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
    slotMaxTime: '19:00:00',
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
    test.innerText = "test";
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
    
        doc.body.appendChild(test);
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