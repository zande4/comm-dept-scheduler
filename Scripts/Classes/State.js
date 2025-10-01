import CourseOffering from "./CourseOffering.js";
import { importEdit } from "../indexSetup.js";

export default class State{
    constructor(){
        this.courseOfferings = [];
    }

    addCourseOffering(courseOffering){
        this.courseOfferings.push(courseOffering);
    }

    getCourseOfferings(){
        return this.courseOfferings;
    }

    isEditState(){
        return (sessionStorage.getItem('coursesToEdit') != null);
    }

    replaceCourse(newCourseOffering){
        const editID = sessionStorage.getItem("coursesToEdit");
        const index = this.courseOfferings.findIndex(c => c.id === editID);
        this.courseOfferings[index] = newCourseOffering;
    }

    saveToSessionStorage(){
        sessionStorage.setItem('courses', JSON.stringify(this.courseOfferings));
        sessionStorage.removeItem('coursesToEdit');
    }

    restoreSessionData(){
        if (sessionStorage.getItem("courses")){
            const data = JSON.parse(sessionStorage.getItem("courses"));
            this.courseOfferings = data.map(obj => CourseOffering.fromJSON(obj));
        }
        //in the event that a course edit button is hit
        if (sessionStorage.getItem("coursesToEdit") && window.location.pathname == "/index.html"){
            importEdit();
        }
    }
}

export const state = new State();