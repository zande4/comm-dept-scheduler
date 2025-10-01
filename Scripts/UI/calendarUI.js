import { requirements } from "../constantData.js";
import { faculty } from "./facultyUI.js";
import { units } from "../constantData.js";

export let calendar;
export let events = [];
let resources = [];
const dropdown = document.getElementById("filter-select");

export function initializeSchedule(){
    const schedule = document.getElementById("schedule");
    calendar = new EventCalendar(schedule, {
    plugins: [ EventCalendar.TimeGrid, EventCalendar.Interaction ],
    customButtons: {},
    view: 'timeGridWeek',
    resources: resources,
    eventStartEditable: false,
    eventDurationEditable: false,
    headerToolbar: {start: "", center: "", end:""},
    dayHeaderFormat: { weekday: 'short' },
    hiddenDays: [0, 6],
    date: "2025-08-03",
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    slotEventOverlap: false,
    allDaySlot: false,
    events: events,
    eventClassNames(info) {
        try{
            if (document.getElementById("color-toggle").checked){
                let u = info.event.resourceIds[info.event.resourceIds.length - 1];
                switch (u){
                    case "Rhetoric":
                        u = "color-rhetoric";
                        break;
                    case "Interpersonal and Organizational Communication":
                        u = "color-ioc";
                        break;
                    case "Performance Studies":
                        u = "color-performance";
                        break;
                    case "Media and Technology Studies":
                        u = "color-mediatech"
                        break;
                    case "Media Arts":
                        u = "color-mediaart"
                        break;
                }
                return [u];
            }
            else{
                return [];
            }
        }
        catch (err) {
            console.error('eventClassNames error', err);
            return [];
        }
    }
    });
}

export function handleColorCodeToggle(){
    calendar.refetchEvents();
}

export function handleFilterSelect(event){
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

export function handleDropdownSelect(){
    let resourceId = dropdown.value;
    let filteredEvents = [];
    events.forEach(event => {
        if (event.resourceIds.includes(resourceId)){
            filteredEvents.push(event);
        }
    });
    calendar.setOption('events', filteredEvents);
}

export function handleClearFilter(){
    calendar.setOption('events', events);
}