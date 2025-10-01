import { DAYS, WEEK } from "../constantData.js";
import { courseNumberToObject, daysToPatternStr } from "../helpers.js";
import { events } from "../UI/calendarUI.js";
import { timeslots } from "../indexSetup.js";
import Timeslot from "./Timeslot.js";
import Course from "./Course.js";

export default class CourseOffering {
    constructor(id, unit, number, instructor, name, description, pathways, enrollment, crosslisted,
        numTA, day_time, recitation, service_rec, year_res, major_res, classroom_select, classroom, active_learning){
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
        this.selected_time = 0;
        this.recitation = recitation;
        this.service_rec = service_rec;
        this.year_res = year_res;
        this.major_res = major_res;
        this.classroom_select = classroom_select;
        this.classroom = classroom;
        this.active_learning = active_learning;
    }

    toFormData(){
        const formData = new FormData();
        formData.append("number", this.number);
        formData.append("instructor", this.instructor);
        formData.append("title", this.name);
        formData.append("description", this.description);
        formData.append("enrollment", this.enrollment);
        formData.append("crosslisted", this.crosslisted);
        formData.append("numTA", this.numTA);
        if (this.recitation){
            formData.append("recitation", "on");
        }
        if (this.service_rec){
            formData.append("service-rec", "on");
        }
        if (this.major_res){
            formData.append("major-res", "on");
        }
        if (this.classroom_select != ""){
            formData.append("classroom-needed", "on");
            formData.append("classroom-select", this.classroom_select);
        }
        if (this.active_learning){
            formData.append("active-classroom", "on");
        }
        formData.append("classroom", this.classroom);
        formData.append("year-res", this.year_res);
        for (let i = 0; i < this.day_time.length; i++){
            let course_time = timeslots.find(t => t.id === this.day_time[i].time.id);
            if (course_time){
                formData.append(`day-${i + 1}`, daysToPatternStr(this.day_time[i].day));
                formData.append(`time-${i + 1}`, course_time.id);
            }
            else{
                //the timeslot field represents a custom timeslot
                formData.append(`other-time-${i + 1}`, "on");
                formData.append(`other-time-start-${i + 1}`, this.day_time[i].time.start);
                formData.append(`other-time-end-${i + 1}`, this.day_time[i].time.end);
                for (const d of this.day_time[i].day){
                    formData.append(`other-${d}-${i + 1}`, "on");
                }
            }
        }
        for (const p of this.pathways){
            formData.append(`${p}-checkbox`, "on");
        }
        return formData;
    }

    toCalendarEvents(){
        //returns an array of object(s) of the format {title: "", start: "", end: ""} for a given course offering
        let rv = {title: "", start: "", end: "", resourceIds: [this.instructor]};
        let reqs = courseNumberToObject(this.number).getCourseReqs();
        reqs.forEach(req  => {
            rv.resourceIds.push(req);
        });
        rv.resourceIds.push(this.unit);
        rv.title = "COMM " + this.number + " " + this.instructor;
        
        let daysofweek = [];
        for (const day of this.day_time[this.selected_time].day){
            if (!(this.recitation && day === "fri")){
                daysofweek.push(DAYS[day]);   
            }
        }
        let timestart = this.day_time[this.selected_time].time.start;
        let timeend = this.day_time[this.selected_time].time.end;
        
        daysofweek.forEach(day => {
            rv.start = WEEK + day + " " + timestart;
            rv.end = WEEK + day + " " + timeend;
            events.push({...rv});
        });
        return rv;
    }

    static fromJSON(obj){
        for (const t of obj.day_time){
            let time = new Timeslot(t.time.id, t.time.dayCompatibility, t.time.start, t.time.end);
            t.time = time;
        }
        return new CourseOffering(obj.id, obj.unit, obj.number, obj.instructor, obj.name, obj.description,
            obj.pathways, obj.enrollment, obj.crosslisted, obj.numTA, obj.day_time, obj.recitation,
            obj.service_rec, obj.year_res, obj.major_res, obj.classroom_select, obj.classroom, obj.active_learning
        );
    }
}