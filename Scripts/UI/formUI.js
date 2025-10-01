import Form from "../Classes/Form.js";
import Course from "../Classes/Course.js";
import { courseArray } from "../parseCourses.js";
import State, {state} from "../Classes/State.js" 
import { timeslots } from "../indexSetup.js";
import { isValidCourseNumber, courseNumIsSpecialTopics, courseNumberToObject, parseTimeToMinutes } from "../helpers.js";

const formElement = document.getElementById("form");

export let submitted = false;
export const form = new Form(formElement);

let selected_course_id = "";
let preferenceData = [{}];

const course_number = document.getElementById("course-num");
const classroom_select = document.getElementById("classroom-select");
const page_number = document.getElementById("page-num");
const page_total = document.getElementById("page-total");
const reqs_list = document.getElementById("requirements-list");
const next_button = document.getElementById("next");
const add_button = document.getElementById("add-course");
const back_button = document.getElementById("back");
const delete_button = document.getElementById("delete-course");

export function handleNext(event){
    event.preventDefault();
    validateManualTime();
    if (formElement.reportValidity()){
        form.save(new FormData(formElement));
        form.next();
        if(!form.isNextLegal()){
            next_button.style.visibility = "hidden";
            add_button.style.visibility = "visible";
        }
        back_button.style.visibility = "visible";
        renderForm();
    }
}

export function handleBack(event){
    event.preventDefault();
    validateManualTime();
    if (formElement.reportValidity()){
        form.save(new FormData(formElement));
        form.back();
        add_button.style.visibility = "hidden";
        next_button.style.visibility = "visible";
        if(!form.isBackLegal()){
            back_button.style.visibility = "hidden";
        }
        renderForm();
    }
}

export function handleAddCourse(event){
    event.preventDefault();
    if (formElement.reportValidity()){
        back_button.style.visibility = "visible";
        delete_button.style.visibility = "visible";
        form.save(new FormData(formElement));
        form.addCourse();
        renderForm();
        document.getElementById("classroom-needed").dispatchEvent(new Event("click"));
        for (let i = 0; i < form.prefCount[form.currentCourse]; i++){
            document.getElementById(`other-time-${i + 1}`).dispatchEvent(new Event("change"));
        }
    }
}

export function handleDeleteCourse(event){
    if (!confirm("Delete course?")) {
        return;
    }
    event.preventDefault();
    form.deleteCourse();
    if (!form.isDeleteLegal()){
        delete_button.style.visibility = "hidden";
    }
    if (!form.isBackLegal()){
        back_button.style.visibility = "hidden";
    }
    renderForm();
}

export function handleAddPreference(event){
    event.preventDefault();
    if (form.getNumberPreferences() >= 3) return;
    form.addPreference();
    savePreferences();
    renderPreferenceHTML();
}

export function handleRemovePreference(event){
    event.preventDefault();
    if (form.getNumberPreferences() <= 1) return;
    const index = Number(event.target.dataset.prefindex) - 1;
    savePreferences();
    preferenceData.splice(index, 1);
    form.deletePreference();
    renderPreferenceHTML();
}

export function savePreferences(){
    let max = form.getNumberPreferences();
    for (let i = 0; i < max; i++){
        preferenceData[i] = {
            day: document.getElementById(`day-${i+1}`).value,
            time: document.getElementById(`time-${i+1}`).value,
            other_time: document.getElementById(`other-time-${i+1}`).checked,
            mon: document.getElementById(`other-mon-${i+1}`).checked,
            tues: document.getElementById(`other-tues-${i+1}`).checked,
            wed: document.getElementById(`other-wed-${i+1}`).checked,
            thur: document.getElementById(`other-thur-${i+1}`).checked,
            fri: document.getElementById(`other-fri-${i+1}`).checked,
            start: document.getElementById(`other-time-start-${i+1}`).value,
            end: document.getElementById(`other-time-end-${i+1}`).value}
    }
}

export function renderPreferenceHTML(){
    for (let i = 0; i < form.getNumberPreferences(); i++){
        document.getElementById(`preference-${i+1}`).style.removeProperty("display");
        document.getElementById(`day-${i+1}`).value = preferenceData[i].day;
        document.getElementById(`day-${i+1}`).dispatchEvent(new Event("change"));
        document.getElementById(`time-${i+1}`).value = preferenceData[i].time;
        document.getElementById(`other-time-${i+1}`).checked = preferenceData[i].other_time;
        document.getElementById(`other-mon-${i+1}`).checked = preferenceData[i].mon;
        document.getElementById(`other-tues-${i+1}`).checked = preferenceData[i].tues;
        document.getElementById(`other-wed-${i+1}`).checked = preferenceData[i].wed;
        document.getElementById(`other-thur-${i+1}`).checked = preferenceData[i].thur;
        document.getElementById(`other-fri-${i+1}`).checked = preferenceData[i].fri;
        document.getElementById(`other-time-start-${i+1}`).value = preferenceData[i].start;
        document.getElementById(`other-time-end-${i+1}`).value = preferenceData[i].end;
    }
    for (let i = form.getNumberPreferences() + 1; i <= 3; i++){
        document.getElementById(`preference-${i}`).style.display = "none";
    }

}

export function renderForm(){
    formElement.reset();
    const data = form.pages[form.currentCourse];
    if (data){
        for (const [name, value] of data.entries()) {
            const field = document.querySelector(`[name="${name}"]`);
            if (!field){
                continue;
            };

            if (field.type === "checkbox" || field.type === "radio") {
                field.checked = value === field.value;
            }
            else {
                field.value = value;
                if (/^day-\d$/.test(name)){
                    field.dispatchEvent(new Event("change"));
                }
            }
        }
    }
    else{
        document.getElementById("day-1").dispatchEvent(new Event("change"));
        document.getElementById("day-2").dispatchEvent(new Event("change"));
        document.getElementById("day-3").dispatchEvent(new Event("change"));
        form.pages[form.currentCourse] = new FormData(formElement);
    }

    preferenceData = [{}];
    savePreferences();

    for (let i = 2; i <= 3; i++){
        if (i <= form.prefCount[form.currentCourse]){
            document.getElementById(`preference-${i}`).style.removeProperty("display");
        }
        else{
            document.getElementById(`preference-${i}`).style.display = "none";
        }
    }

    document.getElementById("classroom-needed").dispatchEvent(new Event("click"));
    for (let i = 0; i < form.prefCount[form.currentCourse]; i++){
        document.getElementById(`other-time-${i + 1}`).dispatchEvent(new Event("change"));
    }

    if (courseNumIsSpecialTopics(course_number.value)){
        document.getElementById("title").required = true;
        document.getElementById("description").required = true;
        const clickEvent = new MouseEvent('click');
        document.getElementById("special-topic").dispatchEvent(clickEvent);
        reqs_list.innerHTML = "";
    }
    else if (course_number.value != ""){
        document.getElementById("title").required = false;
        document.getElementById("description").required = false;
        const reqs = courseNumberToObject(course_number.value).getReqsList();
        reqs_list.innerText = "Requirements satisfied: ";
        if (reqs){
            reqs.forEach (req => {
                reqs_list.innerHTML += req + ";&nbsp;";
            }); 
        }
    }
    page_number.innerText = form.currentCourse + 1;
    page_total.innerText = "/" + form.pages.length;
}

export function handleCourseSelectToggle(event){
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

export function handleCourseNumChange(){
    //reject invalid course numbers
    course_number.setCustomValidity("");
    if (!isValidCourseNumber(course_number.value)){
        course_number.setCustomValidity("Not a valid course number");
    }
    else if (courseNumIsSpecialTopics(course_number.value)){
        document.getElementById("title").required = true;
        document.getElementById("description").required = true;
        const clickEvent = new MouseEvent('click');
        document.getElementById("special-topic").dispatchEvent(clickEvent);
        reqs_list.innerHTML = "";
    }
    else{
        //show requirements satisfied
        reqs_list.innerText = "Requirements satisfied: ";
        document.getElementById("title").required = false;
        document.getElementById("description").required = false;
        if (document.getElementById("special-topic").checked){
            const clickEvent = new MouseEvent('click');
            document.getElementById("number-select").dispatchEvent(clickEvent);
        }
        const reqs = courseNumberToObject(course_number.value).getReqsList();
        reqs.forEach (req => {
            reqs_list.innerHTML += req + ";&nbsp;";
        });
    }
    course_number.reportValidity();
}

export function handleClassroomNeededToggle(event){
    if (event.target.checked){
        classroom_select.style.removeProperty("display");
    }
    else{
        classroom_select.style.display = "none";
    }
}

export function handleSubmit(event){
    //get all field values and create CourseOffering object
    event.preventDefault();
    submitted = true;
    validateManualTime();
    if (formElement.reportValidity() || event.target.id === "submit-data"){
        if (event.target.id === "submit"){
            form.save(new FormData(formElement));
            if (!state.isEditState()){
                for (let i = 0; i < form.pages.length; i++){
                    state.addCourseOffering(form.createCourseOffering(i));
                }
            }
            else{
                state.replaceCourse(form.createCourseOffering(form.currentCourse));
            }
        }
        state.saveToSessionStorage();
        location.href = './summary.html';
    }
}

export function handleOtherTimeToggle(event){    
    let i = event.target.dataset.prefindex;
    if (event.target.checked){
        document.getElementById(`day-${i}`).classList.add("grayed-out");
        document.getElementById(`time-${i}`).classList.add("grayed-out");
        document.getElementById(`other-time-fields-${i}`).style.removeProperty("display");
        document.getElementById(`other-time-start-${i}`).required = true;
        document.getElementById(`other-time-end-${i}`).required = true;
    }
    else{
        document.getElementById(`day-${i}`).classList.remove("grayed-out");
        document.getElementById(`time-${i}`).classList.remove("grayed-out");
        document.getElementById(`other-time-start-${i}`).required = false;
        document.getElementById(`other-time-end-${i}`).required = false;
        document.getElementById(`other-time-fields-${i}`).style.display = "none";
    }
}

export function handleDaySelectChange(event){
    let index = event.target.dataset.prefindex;
    document.getElementById(`time-${index}`).replaceChildren();
    for (const time of timeslots){
        if (time.dayCompatability.includes(document.getElementById(`day-${index}`).value)){
            let opt = document.createElement("option");
            opt.value = time.id;
            opt.innerText = time.toStr();
            document.getElementById(`time-${index}`).appendChild(opt);
        }
    }
}

export function updateReqSummary(){
    const summary = document.getElementById("summary-req-list");
    for (const field of requirements.keys()){
        let item = document.createElement(li);
        let count = document.createElement(span);
        count.innerText = "/";
        item.innerHTML = requirements.get(field)[0] + " ";
        item.appendChild(count);
        summary.appendChild(item);
    }
}

export function handleCourseSearchClick(event){
    selected_course_id = event.currentTarget.id;
    const siblings = Array.from(event.currentTarget.parentElement.children);
    siblings.forEach(row => {
        row.classList.remove("selected");
    });
    event.currentTarget.classList.add("selected");
}

export function handleSelectionConfirmation(event){
    event.preventDefault();
    document.getElementById("course-num").value = selected_course_id;
    document.getElementById("number-select").dispatchEvent(new MouseEvent("click"));
}

export function validateManualTime(){
    for (let i = 1; i <= 3; i++){
        if (document.getElementById(`other-time-${i}`).checked){
            const start = document.getElementById(`other-time-start-${i}`);
            const end = document.getElementById(`other-time-end-${i}`);
            const manDays = document.getElementById(`other-time-days-${i}`).getElementsByTagName("input");
            manDays[0].setCustomValidity("");
            let isDaysEmpty = true; 
            for (const d of manDays){
                if (d.checked){
                    isDaysEmpty = false;
                }
            }
            if (isDaysEmpty){
                manDays[0].setCustomValidity("please select the days of the week the course will be held");
            }
            start.setCustomValidity("");
            end.setCustomValidity("");
            if (parseTimeToMinutes(start.value) >= parseTimeToMinutes(end.value)){
                start.setCustomValidity("start time cannot be later than end time");
                start.reportValidity;
                end.reportValidity;
            }
        }
    }
}

export function sortAndFilter(event){
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

function checkSufficientClassroomSeats(){
    //set validity message if a classroom with insufficient seats is selected
    seats_needed = document.getElementById("enrollment").value;
    seats = classrooms.get(document.getElementById("classroom-select").value).seats;
    if (seats < seats_needed){
        
    }
}

function isPreferenceEmpty(){

}