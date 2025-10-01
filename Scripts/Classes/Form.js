import {timeslots} from "../indexSetup.js";
import Timeslot from "./Timeslot.js";
import CourseOffering from "./CourseOffering.js";
import { formatInstructor } from "../helpers.js";

const unit_select = document.getElementById("unit-name");

export default class Form{
    constructor(formElement){
        this.formElement = formElement;
        this.currentCourse = 0;
        this.pages = [];
        this.prefCount = [];
        this.prefCount[0] = 1;
        this.pages[0] = (new FormData());
    }

    isNextLegal(){
        return (this.currentCourse < this.pages.length - 1);
    }

    isBackLegal(){
        return (this.currentCourse > 0);
    }

    isDeleteLegal(){
        return (this.pages.length > 1);
    }

    isAddLegal(){
        return (this.currentCourse === this.pages.length - 1);
    }

    save(formData){
        this.pages[this.currentCourse] = formData;
    }

    next(){
        this.currentCourse++;
    }

    back(){
        this.currentCourse--;
    }

    addCourse(){
        this.currentCourse++;
        this.prefCount.push(1);
    }

    deleteCourse(){
        this.pages.splice(this.currentCourse, 1);
        this.prefCount.splice(this.currentCourse, 1);
        if (this.pages.length === this.currentCourse){
            this.currentCourse--;
        }
    }

    addPreference(){
        this.prefCount[this.currentCourse] += 1;
    }

    deletePreference(){
        this.prefCount[this.currentCourse] -= 1;
    }

    getNumberPreferences(){
        return this.prefCount[this.currentCourse];
    }

    createCourseOffering(index){
        let entry = this.pages[index];
        let pathways = [];
        const paths = ["cel", "mapc", "mtpc", "ocw", "raa", "moi", "rid", "h"];
        const days = ["mon", "tues", "wed", "thur", "fri"];
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
        if (sessionStorage.getItem('coursesToEdit')){
            cid = (sessionStorage.getItem('coursesToEdit'));
        }
        else{
            cid = crypto.randomUUID();
        }
    
        //create array of day-time objects in the format {day: "", time: Timeslot}
        let time = [];
        let time_value; //holds new timeslot
        let day_value = []; //holds custom days

        for (let i = 1; i <= this.prefCount[index]; i++) {
            if (entry.has(`other-time-${i}`)){
                time_value = new Timeslot(timeslots.length + 1, "", entry.get(`other-time-start-${i}`), entry.get(`other-time-end-${i}`));
                for (let j = 0; j < 5; j++){
                    if (entry.has(`other-${days[j]}-${i}`)){
                        day_value.push(days[j]);
                    }
                    else{
                        console.log(days[j]);
                    }
                }
            }
            else{
                time_value = timeslots.find(obj => obj.id === entry.get(`time-${i}`));
                day_value = entry.get(`day-${i}`).split("-");
            }
            console.log(day_value);
            if (time_value && day_value){
                time.push({day: day_value, time: time_value});
            }
        }
    
        const rv = new CourseOffering(cid, unit_select.value, entry.get("number"), formatInstructor(entry.get("instructor")), entry.get("title"), entry.get("description"), pathways, entry.get("enrollment"), entry.get("crosslisted"),
        entry.get("numTA"), time, entry.get("recitation"), entry.get("service-rec"), entry.get("year-res"), entry.get("major-res"), classroom_select, entry.get("classroom"), entry.get("active-classroom"));
        return rv;
    }  
}