import {generateEventListeners, createTimeslots, UISetup} from "../indexSetup.js";
import {parseCSV} from "../parseCourses.js";
import State, {state} from "../Classes/State.js";

async function main(){
    const data = await parseCSV();
    generateEventListeners();
    createTimeslots();
    UISetup();
    state.restoreSessionData();
}

document.addEventListener('DOMContentLoaded', main);