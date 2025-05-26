let courseOfferings = [];
let courseObjects = [];
let faculty = {};
let events = [];
const WEEK = "2025-08-0";
const DAYS = {sun: "3", mon: "4", tue: "5", wed: "6", thur: "7", fri: "8", sat: "9"};
let unit = "";

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
    courseOfferings.forEach(course => {
        parseCoursesToEvents(course);
    });
    test();
}

function restoreData(){
    unit = localStorage.getItem('unit');
    courseOfferings = JSON.parse(localStorage.getItem('courses'));
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
    document.getElementById("unit-title").innerText = unit;

    //get all counter spans
    const fys_count = document.getElementById("fys-count");
    const commbeyond_count = document.getElementById("commbeyond-count");
    const starter_count = document.getElementById("starter-count");
    const seat_count = document.getElementById("seat-count");
    const moi_count = document.getElementById("moi-count");
    const rid_count = document.getElementById("rid-count");
    const low_count = document.getElementById("low-count");
    const upper_count = document.getElementById("upper-count");
    const cel_count = document.getElementById("cel-count");
    const mapc_count = document.getElementById("mapc-count");
    const mtpc_count = document.getElementById("mtpc-count");
    const ocw_count = document.getElementById("ocw-count");
    const raa_count = document.getElementById("raa-count");
    const commexp_count = document.getElementById("commexp-count");


    //check each course offering to see if criteria are met
    enterInTable(starter_count, getSatisfyingCourses("starter"), 1);
    let num_seats = 0;
    courseOfferings.forEach(course => {
        if (course.enrollment){
            num_seats += Number(course.enrollment);
        }
    });

    //update list
    enterInTable(fys_count, getSatisfyingCourses("FY_SEMINAR"), 1);
    enterInTable(commbeyond_count, getSatisfyingCourses("COMMBEYOND"), 5);
    enterInTable(seat_count, num_seats, 100);
    enterInTable(moi_count, getSatisfyingCourses("m"), 1);
    enterInTable(rid_count, getSatisfyingCourses("r"), 1);
    enterInTable(low_count, getLowerUpper("lower"), 2);
    enterInTable(upper_count, getLowerUpper("upper"), 4);
    enterInTable(cel_count, getSatisfyingCourses("cel"), 1);
    enterInTable(mapc_count, getSatisfyingCourses("mapc"), 1);
    enterInTable(mtpc_count, getSatisfyingCourses("mtpc"), 1);
    enterInTable(ocw_count, getSatisfyingCourses("own"), 1);
    enterInTable(raa_count, getSatisfyingCourses("raa"), 1);
    enterInTable(commexp_count, getSatisfyingCourses("h"), 1);

    //helper functions
    function enterInTable(span, courses, req){
        let num = "";
        if (!Array.isArray(courses)){
            num = courses;
        }
        else{
            num = courses.length;
        }
        span.innerText = num;
        const details = document.getElementById(span.id + "-courses");
        if (num >= req){
            span.parentElement.classList.add("satisfied");
        }
        if (details){
            let child = document.createElement("p")
            courses.forEach(course => {
                child.innerText += "COMM" + course.number + " ";
            });
            details.appendChild(child);
        }
    }

    function getLowerUpper(range){
        let courses = [];
        courseObjects.forEach(course => {
            if(range === "lower" && course.number < 400){
                courses.push(course);
            }
            else if (range === "upper" && course.number >= 400){
                courses.push(course);
            }
        });
        return courses;
    }
}

function getSatisfyingCourses(criterion){
    let satisfying_courses = [];
    if (criterion === "FY-SEMINAR" || criterion === "COMMBEYOND"){
        courseObjects.forEach(course => {
            if (course.ideas.includes(criterion)){
                satisfying_courses.push(course);
            }
        });
    }
    else{
        courseObjects.forEach(course => {
            if (course[criterion] === true){
                satisfying_courses.push(course);
            }
        });
    }
    return satisfying_courses;
}

function generateFacultyList(){
    //populate a table with faculty name in the first column and course numbers in following columns
    let faculty = new Map();
    courseOfferings.forEach(course => {
        let prof = course.instructor.toLowerCase().trim();
        prof = prof.charAt(0).toUpperCase() + prof.slice(1);
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

function parseCoursesToEvents(course){
    //adds an object(s) of the format {title: "", start: "", end: ""} for a given course offering to a global event array
    let rv = {title: "", start: "", end: ""};
    rv.title = "COMM " + course.number;
    let daysofweek = [];
    switch (course.day){
        case "monwedfri":
            daysofweek.push(DAYS.mon);
            daysofweek.push(DAYS.wed);
            daysofweek.push(DAYS.fri);
            break;
        case "monwed":
            daysofweek.push(DAYS.mon);
            daysofweek.push(DAYS.wed);
            break;
        case "tuesthur":
            daysofweek.push(DAYS.tue);
            daysofweek.push(DAYS.thur);
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
    }
    daysofweek.forEach(day => {
        rv.start = WEEK + day + " " + timestart;
        rv.end = WEEK + day + " " + timeend;
        events.push({...rv});
    });
}

function test(){
    const schedule = document.getElementById("schedule");
    const calendar = new EventCalendar(schedule, {
    plugins: [ EventCalendar.TimeGrid ],
    view: 'timeGridWeek',
    headerToolbar: {start: "", center: "", end:""},
    dayHeaderFormat: { weekday: 'short' },
    date: "2025-08-03",
    slotMinTime: '07:00:00',
    slotMaxTime: '19:00:00',
    /*events: [{title:"COMM100", start:"2025-08-03 10:00", end:"2025-8-03 11:00"}, 
            {title:"COMM120", start:"2025-05-23 10:00", end:"2025-5-23 11:00"},
            {title:"COMM100", start:"2025-05-23 10:00", end:"2025-5-23 11:00"},
            {title:"COMM100", start:"2025-05-23 17:00", end:"2025-5-23 19:00"}],*/
    events: events,
    allDaySlot: false
    });
    console.log(events);
}