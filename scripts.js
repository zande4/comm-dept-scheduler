document.addEventListener('DOMContentLoaded', () => {
    parseCSV(() => {
        onLoadBehavior();
        generateEventListeners();
        restoreData();
    });
});

//variables
let unit = "Rhetoric";
let selected_course_id = "";
let formData = [];
let courseOfferings = [];
let currentCourse = 0;
let timeslots = [];
let preferenceData = [{}];
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

class CourseOffering {
    constructor(id, unit, number, instructor, name, description, pathways, enrollment, crosslisted, numTA, day_time, recitation, service_rec, year_res, major_res, classroom_select, classroom){
        this.id = id;
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
    timeslots.push(new Timeslot("01", ["mon-wed-fri"], "08:00", "08:50"));
    timeslots.push(new Timeslot("02", ["mon-wed", "tuesthur"], "08:00", "09:15"));
    timeslots.push(new Timeslot("03", ["mon-wed-fri"], "09:05", "09:55"));
    timeslots.push(new Timeslot("04", ["mon-wed"], "09:05", "10:20"));
    timeslots.push(new Timeslot("05", ["tues-thur"], "09:30", "10:45"));
    timeslots.push(new Timeslot("06", ["mon-wed-fri"], "10:10", "11:00"));
    timeslots.push(new Timeslot("07", ["mon-wed"], "10:10", "11:25"));
    timeslots.push(new Timeslot("08", ["tues-thur"], "11:00", "12:15"));
    timeslots.push(new Timeslot("09", ["mon-wed-fri"], "11:15", "12:05"));
    timeslots.push(new Timeslot("10", ["mon-wed"], "11:15", "12:30"));
    timeslots.push(new Timeslot("11", ["mon-wed-fri"], "12:20", "13:10"));
    timeslots.push(new Timeslot("12", ["mon-wed"], "12:20", "13:35"));
    timeslots.push(new Timeslot("13", ["tues-thur"], "12:30", "13:45"));
    timeslots.push(new Timeslot("14", ["mon-wed-fri"], "13:25", "14:15"));
    timeslots.push(new Timeslot("15", ["mon-wed"], "13:25", "14:40"));
    timeslots.push(new Timeslot("16", ["tues-thur"], "14:00", "15:15"));
    timeslots.push(new Timeslot("17", ["mon", "tues", "wed", "thur", "fri"], "14:45", "17:15"));
    timeslots.push(new Timeslot("18", ["tues-thur"], "15:30", "16:45"));
    timeslots.push(new Timeslot("19", ["tues-thur"], "17:00", "18:15"));
    timeslots.push(new Timeslot("20", ["mon-wed-fri"], "17:45", "18:35"));
    timeslots.push(new Timeslot("21", ["tues-thur"], "17:45", "19:00"));
    timeslots.push(new Timeslot("22", ["mon", "tues", "wed", "thur", "fri"], "17:45", "20:15"));
    timeslots.push(new Timeslot("23", ["mon", "wed", "fri"], "12:20", "14:50"));
    timeslots.push(new Timeslot("24", ["mon", "wed", "fri"], "13:25", "15:55"));
    timeslots.push(new Timeslot("25", ["mon", "wed", "fri"], "14:30", "17:00"));
    timeslots.push(new Timeslot("26", ["mon", "wed", "fri"], "15:35", "18:05"));
    timeslots.push(new Timeslot("27", ["mon", "wed", "fri"], "16:40", "19:10"));
    timeslots.push(new Timeslot("28", ["tues", "thur"], "11:00", "13:30"));
    timeslots.push(new Timeslot("29", ["tues", "thur"], "12:30", "15:00"));
    timeslots.push(new Timeslot("30", ["tues", "thur"], "14:00", "16:30"));
    timeslots.push(new Timeslot("31", ["tues", "thur"], "15:30", "18:00"));

    document.getElementById("preference-2").style.display = "none";
    document.getElementById("preference-3").style.display = "none";

    formData[0] = (new FormData(form));
    formData[0].set("numPreferences", 1);
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

function handleDaySelectChange(event){
    let index = event.target.dataset.prefindex;
    document.getElementById(`time-${index}`).replaceChildren();
    for (const time of timeslots){
        if (time.dayCompatability.includes(document.getElementById(`day-${index}`).value)){
            let opt = document.createElement("option");
            opt.value = time.id;
            opt.innerText = timeslotToString(time);
            document.getElementById(`time-${index}`).appendChild(opt);
        }
    }
}

function parseCoursesToFormData(course){
    course_number.value = course.number;
    course_number.dispatchEvent(new Event("change"));
    unit_select.value = course.unit;
    instructor.value = course.instructor;
    document.getElementById("title").value = course.name;
    document.getElementById("description").value = course.description;
    document.getElementById("enrollment").value = course.enrollment;
    document.getElementById("crosslisted").value = course.crosslisted;
    document.getElementById("numTA").value = course.numTA;
    document.getElementById("recitation").checked = course.recitation;
    document.getElementById("service-rec").checked = course.service_rec;
    document.getElementById("year-res").value = course.year_res;
    document.getElementById("major-res").checked = course.major_res;
    if (typeof(course.classroom_select) === "string" && course.classroom_select != ""){
        document.getElementById("classroom-needed").checked = true;
        document.getElementById("classroom-needed").dispatchEvent(new Event("click"));
    }
    classroom_select.value = course.classroom_select;
    document.getElementById("classroom").value = course.classroom;
    let i = 1;
    for (const times of course.day_time){
        if (i > 1){
            document.getElementById("add-pref-button").dispatchEvent(new Event("click"));
        }
        let day_sel = document.getElementById(`day-${i}`);
        let time_sel = document.getElementById(`time-${i}`);
        let other_time_start = document.getElementById(`other-time-start-${i}`);
        let other_time_end = document.getElementById(`other-time-end-${i}`);
        //if there exists a timeslot with the same id as the course timeslot
        let course_time = timeslots.find(t => t.id === times.time.id);
        if (course_time){
            day_sel.value = daysToPatternStr(times.day);
            day_sel.dispatchEvent(new Event("change"));
            time_sel.value = course_time.id;
        }
        else{
            //the timeslot is other
            document.getElementById(`other-time-${i}`).checked = true;
            document.getElementById(`other-time-${i}`).dispatchEvent(new Event("change"));
            other_time_start.value = times.time.start;
            other_time_end.value = times.time.end;
            for (const d of times.day){
                document.getElementById(`other-${d}-${i}`).checked = true;
            }
        }
        i++;
    }
    for (const p of course.pathways){
        document.getElementById(`${p}-checkbox`).checked = true;
    }

    function daysToPatternStr(days){
        rv = "";
        for (const d of days){
            rv += d + "-";
        }
        rv = rv.slice(0, -1);
        return rv;
    }
}
//EVENT LISTENERS

function generateEventListeners(){
    unit_select.addEventListener("change", function() {
        unit = unit_select.value;
    });

    for (let i = 1; i <= 3; i++){
        document.getElementById(`day-${i}`).addEventListener("change", handleDaySelectChange);
        document.getElementById('day-1').dispatchEvent(new Event("change"));
        document.getElementById(`other-time-fields-${i}`).style.display = "none";
        document.getElementById(`other-time-${i}`).addEventListener("change", handleOtherTimeToggle);
        document.getElementById(`pref-remove-${i}`).addEventListener("click", handleRemovePreference);
    }
    const other_time = document.getElementById("other-time");
    const other_time_days = document.getElementById("other-time-days");
    const other_time_fields = document.getElementById("other-time-fields");
    const num_radio = document.getElementById("number-select");
    const search = document.getElementById("course-search");
    const special = document.getElementById("special-topics-fields");
    search.style.display = "none";
    special.style.display = "none";
    num_radio.checked = true;


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

    delete_button.style.visibility = "hidden";
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

function restoreData(){
    if (localStorage.getItem("coursesToEdit")){
        courseOfferings = JSON.parse(localStorage.getItem("courses"));
        parseCoursesToFormData(JSON.parse(localStorage.getItem("coursesToEdit")));
    }
}

function renderForm(){
    form.reset();
    const data = formData[currentCourse];
    if (data){
        for (const [name, value] of data.entries()) {
            const field = document.querySelector(`[name="${name}"]`);
            if (!field) continue;

            if (field.type === "checkbox" || field.type === "radio") {
                field.checked = value === field.value;
            } else {
                field.value = value;
            }
        }
    }
    else{
        formData[currentCourse] = new FormData(form);
        formData[currentCourse].set("numPreferences", 1);
    }

    for (let i = 2; i <= 3; i++){
        if (i <= formData[currentCourse].get("numPreferences")){
            document.getElementById(`preference-${i}`).style.removeProperty("display");
        }
        else{
            document.getElementById(`preference-${i}`).style.display = "none";
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
        if (reqs){
            reqs.forEach (req => {
                reqs_list.innerHTML += req + ";&nbsp;";
            }); 
        }
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
    const paths = ["cel", "mapc", "mtpc", "ocw", "raa", "moi", "rid", "h"];
    const days = ["mon", "tue", "wed", "thur", "fri"];
    paths.forEach(path => {
        if (entry.has(path)){
            pathways.push(path);
        }
    })

    let classroom_select = "";
    if (entry.has("classroom-needed")){
        classroom_select = entry.get("classroom-select");
    }

    let cid = "";
    if (localStorage.getItem('coursesToEdit')){
        cid = JSON.parse(localStorage.getItem('coursesToEdit')).id;
    }
    else{
        cid = crypto.randomUUID();
    }

    //create array of day-time objects in the format {day: "", time: Timeslot}
    let time = [];
    let time_value;
    let day_value = [];
    for (let i = 1; i <= entry.get("numPreferences"); i++) {
        if (entry.has(`other-time-${i}`)){
            time_value = new Timeslot(timeslots.length + 1, "", entry.get(`other-time-start-${i}`), entry.get(`other-time-end-${i}`));
            for (let j = 0; j < 5; j++){
                if (entry.has(`other-${days[j]}-${i}`)){
                    day_value.push(days[j]);
                }
            }
        }
        else{
            time_value = timeslots.find(obj => obj.id === entry.get(`time-${i}`));
            day_value = entry.get(`day-${i}`).split("-");
        }

        if (time_value && day_value){
            time.push({day: day_value, time: time_value});
        }
    }

    return new CourseOffering(cid, unit, entry.get("number"), entry.get("instructor"), entry.get("title"), entry.get("description"), pathways, entry.get("enrollment"), entry.get("crosslisted"),
     entry.get("numTA"), time, entry.get("recitation"), entry.get("service-rec"), entry.get("year-res"), entry.get("major-res"), classroom_select, entry.get("classroom"));
}

function courseNumberToObject(number){
    return courseArray.find(course => course.number === number);
}

function handleNext(event){
    event.preventDefault();
    if (form.reportValidity()){
        const pref = formData[currentCourse].get("numPreferences");
        formData[currentCourse] = (new FormData(form));
        formData[currentCourse].set("numPreferences", pref);
        currentCourse++;
        if(currentCourse == (formData.length - 1)){
            next_button.style.display = "none";
            add_button.style.visibility = "visible";
        }
        back_button.style.removeProperty("display");
        renderForm();
    }
}

function handleBack(event){
    event.preventDefault();
    if (form.reportValidity()){
        const pref = formData[currentCourse].get("numPreferences");
        formData[currentCourse] = (new FormData(form));
        formData[currentCourse].set("numPreferences", pref);
        add_button.style.visibility = "hidden";
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
        delete_button.style.visibility = "visible";
        const pref = formData[currentCourse].get("numPreferences");
        formData[currentCourse] = (new FormData(form));
        formData[currentCourse].set("numPreferences", pref);
        currentCourse++;
        renderForm();
    }
}

function handleDeleteCourse(event){
    event.preventDefault();
    formData.splice(currentCourse, 1);
    if (formData.length <= 1){
        delete_button.style.visibility = "hidden";
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
        const pref = formData[currentCourse].get("numPreferences");
        formData[currentCourse] = (new FormData(form));
        formData[currentCourse].set("numPreferences", pref);
        if (localStorage.getItem("coursesToEdit") === null){
            for (let i = 0; i < formData.length; i++){
                courseOfferings.push(createCourseOffering(i));
            }
        }
        else{
            courseOfferings[courseOfferings.findIndex(c => c.id === JSON.parse(localStorage.getItem("coursesToEdit")).id)] = createCourseOffering(currentCourse);
        }
        
        //Save to localStorage
        localStorage.setItem('courses', JSON.stringify(courseOfferings));
        localStorage.setItem('coursesToEdit', null);
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

function handleOtherTimeToggle(event){
    let i = event.target.dataset.prefindex;
    if (event.target.checked){
        document.getElementById(`day-${i}`).classList.add("grayed-out");
        document.getElementById(`time-${i}`).classList.add("grayed-out");
        document.getElementById(`other-time-fields-${i}`).style.removeProperty("display");
    }
    else{
        document.getElementById(`day-${i}`).classList.remove("grayed-out");
        document.getElementById(`time-${i}`).classList.remove("grayed-out");
        document.getElementById(`other-time-fields-${i}`).style.display = "none";
    }
}

function handleAddPreference(event){
    event.preventDefault();
    if (preferenceData.length >= 3) return;
    savePreferences();
    preferenceData.push({});
    formData[currentCourse].set("numPreferences", Number(formData[currentCourse].get("numPreferences")) + 1);
    renderPreferenceHTML();
}

function handleRemovePreference(event){
    event.preventDefault();
    const index = Number(event.target.dataset.prefindex) - 1;
    if (preferenceData.length <= 1) return;
    savePreferences();
    preferenceData.splice(index, 1);
    formData[currentCourse].set("numPreferences", Number(formData[currentCourse].get("numPreferences")) - 1);
    renderPreferenceHTML();
}

function savePreferences(){
    let max = preferenceData.length;
    for (let i = 0; i < max; i++){
        preferenceData[i] = {
            day: document.getElementById(`day-${i+1}`).value,
            time: document.getElementById(`time-${i+1}`).value,
            other_time: document.getElementById(`other-time-${i+1}`).checked,
            mon: document.getElementById(`other-mon-${i+1}`).checked,
            tue: document.getElementById(`other-tue-${i+1}`).checked,
            wed: document.getElementById(`other-wed-${i+1}`).checked,
            thur: document.getElementById(`other-thur-${i+1}`).checked,
            fri: document.getElementById(`other-fri-${i+1}`).checked,
            start: document.getElementById(`other-time-start-${i+1}`).value,
            end: document.getElementById(`other-time-end-${i+1}`).value}
    }
}

function renderPreferenceHTML(){
    for (let i = 0; i < preferenceData.length; i++){
        document.getElementById(`preference-${i+1}`).style.removeProperty("display");
        document.getElementById(`day-${i+1}`).value = preferenceData[i].day;
        document.getElementById(`day-${i+1}`).dispatchEvent(new Event("change"));
        document.getElementById(`time-${i+1}`).value = preferenceData[i].time;
        document.getElementById(`other-time-${i+1}`).checked = preferenceData[i].other_time;
        document.getElementById(`other-mon-${i+1}`).checked = preferenceData[i].mon;
        document.getElementById(`other-tue-${i+1}`).checked = preferenceData[i].tue;
        document.getElementById(`other-wed-${i+1}`).checked = preferenceData[i].wed;
        document.getElementById(`other-thur-${i+1}`).checked = preferenceData[i].thur;
        document.getElementById(`other-fri-${i+1}`).checked = preferenceData[i].fri;
        document.getElementById(`other-time-start-${i+1}`).value = preferenceData[i].start;
        document.getElementById(`other-time-end-${i+1}`).value = preferenceData[i].end;
    }
    for (let i = preferenceData.length + 1; i <= 3; i++){
        document.getElementById(`preference-${i}`).style.display = "none";
    }

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