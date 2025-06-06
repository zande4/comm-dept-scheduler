document.addEventListener('DOMContentLoaded', () => {
    parseCSV(() => {
        onLoadBehavior();
        generateEventListeners();
    });
});

//variables
let unit = "Rhetoric";
let selected_course_id = "";
let formData = [];
let courseOfferings = [];
let currentCourse = 0;
let timeslots = [];
//HTML nodes
const unit_select = document.getElementById("unit-name");
const course_number = document.getElementById("course-num");
const back_button = document.getElementById("back");
const add_button = document.getElementById("add-course");
const delete_button = document.getElementById("delete-course");
const next_button = document.getElementById("next");
const page_number = document.getElementById("page-num");
const page_total = document.getElementById("page-total");
const instructor = document.getElementById("instructor");
const reqs_list = document.getElementById("requirements-list");
const classroom_select = document.getElementById("classroom-select");
const time_select = document.getElementById("time");
const day_select = document.getElementById("day");

class CourseOffering {
    constructor(unit, number, instructor, name, description, pathways, enrollment, crosslisted, numTA, day_time, other_time, other_time_days,
        other_time_hours, recitation, service_rec, year_res, major_res, classroom_select, classroom){
        this.unit = unit;
        this.number = number;
        this.instructor = instructor;
        this.name = name;
        this.description = description;
        this.pathways = pathways;
        this.enrollment = enrollment;
        this.crosslisted = crosslisted;
        this.numTA = numTA;
        this.day_time = day_time;
        this.other_time = other_time;
        this.other_time_days = other_time_days;
        this.other_time_hours = other_time_hours;
        this.recitation = recitation;
        this.service_rec = service_rec;
        this.year_res = year_res;
        this.major_res = major_res;
        this.classroom_select = classroom_select;
        this.classroom = classroom;
    }
}

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

class Timeslot{
    constructor(id, dayCompatability, start, end){
        this.id = id;
        this.dayCompatability = dayCompatability;
        this.start = start;
        this.end = end;
    }
}


function onLoadBehavior(){
    timeslots.push(new Timeslot("01", ["monwedfri"], "08:00", "08:50"));
    timeslots.push(new Timeslot("02", ["monwed", "tuesthur"], "08:00", "09:15"));
    timeslots.push(new Timeslot("03", ["monwedfri"], "09:05", "09:55"));
    timeslots.push(new Timeslot("04", ["monwed"], "09:05", "10:20"));
    timeslots.push(new Timeslot("05", ["tuesthur"], "09:30", "10:45"));
    timeslots.push(new Timeslot("06", ["monwedfri"], "10:10", "11:00"));
    timeslots.push(new Timeslot("07", ["monwed"], "10:10", "11:25"));
    timeslots.push(new Timeslot("08", ["tuesthur"], "11:00", "12:15"));
    timeslots.push(new Timeslot("09", ["monwedfri"], "11:15", "12:05"));
    timeslots.push(new Timeslot("10", ["monwed"], "11:15", "12:30"));
    timeslots.push(new Timeslot("11", ["monwedfri"], "12:20", "13:10"));
    timeslots.push(new Timeslot("12", ["monwed"], "12:20", "13:35"));
    timeslots.push(new Timeslot("13", ["tuesthur"], "12:30", "13:45"));
    timeslots.push(new Timeslot("14", ["monwedfri"], "13:25", "14:15"));
    timeslots.push(new Timeslot("15", ["monwed"], "13:25", "14:40"));
    timeslots.push(new Timeslot("16", ["tuesthur"], "14:00", "15:15"));
    timeslots.push(new Timeslot("17", ["mon"], "14:45", "17:25"));
    timeslots.push(new Timeslot("18", ["tuesthur"], "15:30", "16:45"));
    timeslots.push(new Timeslot("19", ["tuesthur"], "17:00", "18:15"));
    timeslots.push(new Timeslot("20", ["monwedfri"], "17:45", "18:35"));
    timeslots.push(new Timeslot("21", ["tuesthur"], "17:45", "19:00"));
    timeslots.push(new Timeslot("22", ["mon"], "17:45", "20:25"));

    handleDaySelectChange();
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

function handleDaySelectChange(){
    time_select.replaceChildren();
    for (const time of timeslots){
        if (time.dayCompatability.includes(day_select.value)){
            let opt = document.createElement("option");
            opt.value = time.id;
            opt.innerText = timeslotToString(time);
            time_select.appendChild(opt);
        }
    }
}
//EVENT LISTENERS

function generateEventListeners(){
    unit_select.addEventListener("change", function() {
        unit = unit_select.value;
    });
    day_select.addEventListener("change", handleDaySelectChange);

    const other_time = document.getElementById("other-time");
    const other_time_days = document.getElementById("other-time-days");
    const other_time_hours = document.getElementById("other-time-hours");
    const num_radio = document.getElementById("number-select");
    const search = document.getElementById("course-search");
    const special = document.getElementById("special-topics-fields");
    search.style.display = "none";
    special.style.display = "none";
    num_radio.checked = true;
    other_time_days.style.display = "none";
    other_time_hours.style.display = "none";
    document.querySelector("label[for='other-time-days']").style.display = "none";
    document.querySelector("label[for='other-time-hours']").style.display = "none";
    other_time.addEventListener("change", function() {
        if (other_time.checked){
            day_select.classList.add("grayed-out");
            time_select.classList.add("grayed-out");
            document.querySelector("label[for='other-time-days']").style.removeProperty("display");
            document.querySelector("label[for='other-time-hours']").style.removeProperty("display");
            other_time_days.style.removeProperty("display");
            other_time_hours.style.removeProperty("display");
        }
        else{
            day_select.classList.remove("grayed-out");
            time_select.classList.remove("grayed-out");
            other_time_days.style.display = "none";
            other_time_hours.style.display = "none";
            document.querySelector("label[for='other-time-days']").style.display = "none";
            document.querySelector("label[for='other-time-hours']").style.display = "none";
        }
    });

    const submit = document.getElementById("submit");
    const form = document.getElementById("form");
    submit.addEventListener("click", handleSubmit);

    form.addEventListener("change", handleCourseSelectToggle);

    course_number.addEventListener("change", handleCourseNumChange);
    course_number.addEventListener("input", () => {
        course_number.setCustomValidity('');
    });

    const pref_button = document.getElementById("add-pref-button");
    pref_button.addEventListener("click", handleAddPreference);

    next_button.style.display = "none";
    next_button.addEventListener("click", handleNext);

    back_button.style.display = "none";
    back_button.addEventListener("click", handleBack);

    add_button.addEventListener("click", handleAddCourse);

    delete_button.style.display = "none";
    delete_button.addEventListener("click", handleDeleteCourse);

    const filter_button = document.getElementById("submit-search");
    filter_button.addEventListener("click", sortAndFilter);

    const confirm_button = document.getElementById("confirm-selection");
    confirm_button.addEventListener("click", handleSelectionConfirmation);

    const test_button = document.getElementById("test-button");
    test_button.addEventListener("click", handleTestButton);

    document.getElementById("classroom-needed").addEventListener("click", handleClassroomNeededToggle);
    classroom_select.style.display = "none";

    document.getElementById("import").addEventListener("change", handleImport);
}

//END EVENT LISTENERS

function renderForm(){
    form.reset();
    for (const [name, value] of formData[currentCourse].entries()) {
        const field = document.querySelector(`[name="${name}"]`);
        if (!field) continue;

        if (field.type === "checkbox" || field.type === "radio") {
            field.checked = value === field.value;
        } else {
            field.value = value;
        }
    }
    if (course_number.value === "89" || course_number.value === "390" || course_number.value === "490" || course_number.value === "690"){
        document.getElementById("title").required = true;
        document.getElementById("description").required = true;
        const clickEvent = new MouseEvent('click');
        document.getElementById("special-topic").dispatchEvent(clickEvent);
        reqs_list.innerHTML = "";
    }
    else{
        document.getElementById("title").required = false;
        document.getElementById("description").required = false;
        const reqs = getReqsListFromCourseNum(course_number.value);
        reqs_list.innerText = "Requirements satisfied: ";
        reqs.forEach (req => {
            reqs_list.innerHTML += req + ";&nbsp;";
        }); 
    }
    page_number.innerText = currentCourse + 1;
    page_total.innerText = "/" + formData.length;
}

function handleCourseSearchClick(event){
    selected_course_id = event.currentTarget.id;
    const siblings = Array.from(event.currentTarget.parentElement.children);
    siblings.forEach(row => {
        row.classList.remove("selected");
    });
    event.currentTarget.classList.add("selected");
}

function handleSelectionConfirmation(event){
    event.preventDefault();
    document.getElementById("course-num").value = selected_course_id;
}

function sortAndFilter(event){
    //get search parameters
    event.preventDefault();
    const filter_moi = document.getElementById("moi-filter").checked;
    const filter_rid = document.getElementById("rid-filter").checked;
    const filter_commexp = document.getElementById("commexp-filter").checked;
    const filter_starter = document.getElementById("starter-filter").checked;
    const filter_cel = document.getElementById("cel-filter").checked;
    const filter_mapc = document.getElementById("mapc-filter").checked;
    const filter_mtpc = document.getElementById("mtpc-filter").checked;
    const filter_ocw = document.getElementById("ocw-filter").checked;
    const filter_raa = document.getElementById("raa-filter").checked;
    const sort = document.getElementById("sort").value;

    //filter for courses that meet the parameters (AND search)
    let output = [];
    courseArray.forEach(course => {
        let desired = (filter_moi && course.m) || (filter_rid && course.r) || (filter_commexp && course.h) || (filter_starter && course.starter)
        || (filter_cel && course.cel) || (filter_mapc && course.mapc) || (filter_mtpc && course.mtpc) || (filter_ocw && course.ocw) || (filter_raa && course.raa);
        if (desired){
            output.push(course);
        }
    });

    //sort
    if (sort === "descend"){
        output.sort((a, b) => (String(b.number)).substring(0, 3) - (String(a.number)).substring(0, 3));
    }
    else if (sort === "ascend"){
        output.sort((a, b) => (String(a.number)).substring(0, 3) - (String(b.number)).substring(0, 3));
    }

    //show search output
    const search_output = document.getElementById("search-output");
    search_output.innerHTML = "";
    output.forEach(course => {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.innerText = "COMM" + course.number + " " + course.name;
        row.appendChild(cell);
        row.id = course.number;
        row.addEventListener("click", handleCourseSearchClick);
        search_output.appendChild(row);
    });
}

function createCourseOffering(index){
    let entry = formData[index];
    let pathways = [];
    let paths = ["cel", "mapc", "mtpc", "ocw", "raa"];
    paths.forEach(path => {
        pathways.push(entry.get(path));
    })

    //create array of day-time objects in the format {day: "", time: Timeslot}
    let time = [];
    for (let i = 1; i <= 3; i++) {
        const time_value = entry.get(`timeslot-${i}`);
        const day_value = entry.get(`day-${i}`);

        if (time_value && day_value){
            time.push({day: day_value, time: timeslots.find(obj => obj.id === time_value)});
        }
    }
    console.log(time);

    return new CourseOffering(unit, entry.get("number"), entry.get("instructor"), entry.get("title"), entry.get("description"), pathways, entry.get("enrollment"), entry.get("crosslisted"),
     entry.get("numTA"), time, entry.get("other-time"), entry.get("other-time-days"),
     entry.get("other-time-hours"), entry.get("recitation"), entry.get("service-rec"), entry.get("year-res"), entry.get("major-res"), entry.get("classroom-select"), entry.get("classroom"));
}

function courseNumberToObject(number){
    return courseArray.find(course => course.number === number);
}

function handleNext(event){
    event.preventDefault();
    if (form.reportValidity()){
        formData[currentCourse] = (new FormData(form));
        currentCourse++;
        if(currentCourse == (formData.length - 1)){
            next_button.style.display = "none";
            add_button.style.removeProperty("display");
        }
        back_button.style.removeProperty("display");
        renderForm();
    }
}

function handleBack(event){
    event.preventDefault();
    if (form.reportValidity()){
        formData[currentCourse] = (new FormData(form));
        add_button.style.display = "none";
        next_button.style.removeProperty('display');
        currentCourse--;
        if(currentCourse == 0){
            back_button.style.display = "none";
        }
        renderForm();
    }
}

function handleAddCourse(event){
    event.preventDefault();
    if (form.reportValidity()){
        back_button.style.removeProperty("display");
        delete_button.style.removeProperty("display");
        formData[currentCourse] = (new FormData(form));
        currentCourse++;
        form.reset();
        reqs_list.innerText = "Requirements satisfied: ";
        page_number.innerText = currentCourse + 1;
        page_total.innerText = "/" + (formData.length + 1);
    }
}

function handleDeleteCourse(event){
    event.preventDefault();
    formData.splice(currentCourse, currentCourse);
    if (formData.length <= 1){
        delete_button.style.display = "none";
    }
    if (formData.length === currentCourse){
        currentCourse--;
    }
    renderForm();
}

function handleCourseSelectToggle(event){
    const target = event.target;
    const num = document.getElementById("course-num-wrapper");
    const special = document.getElementById("special-topics-fields");
    const search = document.getElementById("course-search");
    if (target.name === 'course-select' && target.type === 'radio') {
        switch (target.value){
            case "number":
                num.style.removeProperty("display");
                special.style.display = "none";
                search.style.display = "none";
                break;
            case "special":
                num.style.removeProperty("display");
                special.style.removeProperty("display");
                search.style.display = "none";
                break;
            case "search":
                search.style.removeProperty("display");
                num.style.display = "none";
                special.style.display = "none";
                break;
        }
    }
}

function handleCourseNumChange(){
    //reject invalid course numbers
    course_number.setCustomValidity("");
    let valid = false;
    courseArray.forEach(course =>{
        if(course_number.value === course.number){
            valid = true;
        }
    });
    if (!valid){
        course_number.setCustomValidity("Not a valid course number");
    }
    else if (course_number.value === "89" || course_number.value === "390" || course_number.value === "490" || course_number.value === "690"){
        //if special topics course
        document.getElementById("title").required = true;
        document.getElementById("description").required = true;
        //document.getElementById("special-topic").checked = true;
        const clickEvent = new MouseEvent('click');
        document.getElementById("special-topic").dispatchEvent(clickEvent);
        reqs_list.innerHTML = "";
    }
    else{
        //show requirements satisfied
        document.getElementById("title").required = false;
        document.getElementById("description").required = false;
        if (document.getElementById("special-topic").checked){
            const clickEvent = new MouseEvent('click');
            document.getElementById("number-select").dispatchEvent(clickEvent);
            reqs_list.innerText = "Requirements satisfied: ";
        }
        const reqs = getReqsListFromCourseNum(course_number.value);
        reqs.forEach (req => {
            reqs_list.innerHTML += req + ";&nbsp;";
        });
    }
    course_number.reportValidity();


    
}

function getReqsListFromCourseNum(number){
    if(typeof(number) != "string" || number.length === 0){
        return;
    }
    let reqs = [];
    const course_object = courseNumberToObject(number);
    if (course_object.cel){
        reqs.push("Communication and Everyday Life");
    }
    if (course_object.mapc){
        reqs.push("Media Arts, Performance, and Critical Practice");
    }
    if (course_object.mtpc){
        reqs.push("Media Technologies and Public Culture");
    }
    if (course_object.ocw){
        reqs.push("Organization, Communication, and Work");
    }
    if (course_object.raa){
        reqs.push("Rhetoric, Activism, and Advocacy");
    }
    if (course_object.m){
        reqs.push("Modes of Inquiry");
    }
    if (course_object.r){
        reqs.push("Representation Identity and Difference");
    }
    return reqs;
}

function handleClassroomNeededToggle(event){
    if (event.target.checked){
        classroom_select.style.removeProperty("display");
    }
    else{
        classroom_select.style.display = "none";
    }
}

function handleSubmit(event){
    //get all field values and create CourseOffering object
    event.preventDefault();
    if (form.reportValidity()){
        formData[currentCourse] = (new FormData(form));
        for (let i = 0; i < formData.length; i++){
            courseOfferings.push(createCourseOffering(i));
        }
        //Save to localStorage
        localStorage.setItem('courses', JSON.stringify(courseOfferings));
        location.href = './summary.html';
    }
    
}

function handleTestButton(event){
    event.preventDefault();
    course_number.value = "120";
    instructor.value = "Zoe";
    handleAddCourse(event);
    course_number.value = "62";
    document.getElementById("day").value = "tuesthur";
    document.getElementById("time").value = "8";
    instructor.value = "Avi";
    handleSubmit(event);
}

function handleAddPreference(event){
    event.preventDefault();
}

function handleImport(event){
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for(const file of files){
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                courseOfferings.push(...JSON.parse(e.target.result));
            } catch (err) {
                console.error("Invalid JSON file:", err);
            }
        };
        reader.readAsText(file);
    }
}