import * as handlers from "./UI/formUI.js";
import { handleImport } from "./import.js";
import Timeslot from "./Classes/Timeslot.js";
import { submitted } from "./UI/formUI.js";
import CourseOffering from "./Classes/CourseOffering.js";
import { form, renderForm } from "./UI/formUI.js"
import { getCourseOfferingFromCid } from "./helpers.js";

export let timeslots = [];

window.addEventListener("beforeunload", function (e) {
    if (!submitted && this.window.location.pathname == "/index.html"){
        e.preventDefault();
        e.returnValue = "";
    }
});

export function generateEventListeners(){
    const pref_button = document.getElementById("add-pref-button");
    pref_button.addEventListener("click", handlers.handleAddPreference);

    const next_button = document.getElementById("next");
    next_button.style.visibility = "hidden";
    next_button.addEventListener("click", handlers.handleNext);

    const back_button = document.getElementById("back");
    back_button.style.visibility = "hidden";
    back_button.addEventListener("click", handlers.handleBack);

    const add_button = document.getElementById("add-course");
    add_button.addEventListener("click", handlers.handleAddCourse);

    const delete_button = document.getElementById("delete-course");
    delete_button.style.visibility = "hidden";
    delete_button.addEventListener("click", handlers.handleDeleteCourse);

    const filter_button = document.getElementById("submit-search");
    filter_button.addEventListener("click", handlers.sortAndFilter);

    const confirm_button = document.getElementById("confirm-selection");
    confirm_button.addEventListener("click", handlers.handleSelectionConfirmation);

    document.getElementById("classroom-needed").addEventListener("click", handlers.handleClassroomNeededToggle);

    const classroom_select = document.getElementById("classroom-select");
    classroom_select.style.display = "none";

    document.getElementById("import").addEventListener("change", handleImport);

    const num_radio = document.getElementById("number-select");
    num_radio.checked = true;

    const search = document.getElementById("course-search");
    search.style.display = "none";

    const special = document.getElementById("special-topics-fields");
    special.style.display = "none";

    const submit = document.getElementById("submit");
    submit.addEventListener("click", handlers.handleSubmit);

    document.getElementById("submit-data").addEventListener("click", handlers.handleSubmit);

    for (let i = 1; i <= 3; i++){
        document.getElementById(`day-${i}`).addEventListener("change", handlers.handleDaySelectChange);
        document.getElementById('day-1').dispatchEvent(new Event("change"));
        document.getElementById(`other-time-fields-${i}`).style.display = "none";
        document.getElementById(`other-time-${i}`).addEventListener("change", handlers.handleOtherTimeToggle);
        document.getElementById(`pref-remove-${i}`).addEventListener("click", handlers.handleRemovePreference);
    }

    document.getElementById("form").addEventListener("change", handlers.handleCourseSelectToggle);

    const course_number = document.getElementById("course-num");
    course_number.addEventListener("change", handlers.handleCourseNumChange);
    course_number.addEventListener("input", () => {
        course_number.setCustomValidity('');
    });
}

export function createTimeslots(){
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
    timeslots.push(new Timeslot("32", ["mon-wed"], "14:30", "15:45"));
    timeslots.push(new Timeslot("33", ["mon-wed"], "15:35", "16:50"));
    timeslots.push(new Timeslot("34", ["mon-wed"], "16:40", "17:55"));
    timeslots.push(new Timeslot("35", ["mon-wed"], "17:45", "19:00"));
}

export function UISetup(){
    document.getElementById("day-1").dispatchEvent(new Event("change"));
    document.getElementById("day-2").dispatchEvent(new Event("change"));
    document.getElementById("day-3").dispatchEvent(new Event("change"));
    document.getElementById("preference-2").style.display = "none";
    document.getElementById("preference-3").style.display = "none";
    document.getElementById("form").reset();
}

export function importEdit(){
    const co = getCourseOfferingFromCid(sessionStorage.getItem("coursesToEdit"));
    const im = co.toFormData();
    form.pages = [im];
    form.prefCount = [co.day_time.length];
    renderForm();
    document.getElementById("course-num").dispatchEvent(new Event("change"));
    document.getElementById("unit-name").value = co.unit;
    document.getElementById("classroom-needed").dispatchEvent(new Event("click"));
    for (let i = 0; i < co.day_time.length; i++){
        document.getElementById(`other-time-${i + 1}`).dispatchEvent(new Event("change"));
    }
    document.getElementById("import-container").style.display = "none";
    document.getElementById("add-course").style.visibility = "hidden";
}