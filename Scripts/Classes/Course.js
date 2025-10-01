import { requirements } from "../constantData.js";

export default class Course{
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

    getReqsList(){
        let reqs = [];
        const course_object = this;
        if(course_object.cel){
            reqs.push("Communication and Everyday Life");
        }
        if(course_object.mapc){
            reqs.push("Media Arts, Performance, and Critical Practice");
        }
        if(course_object.mtpc){
            reqs.push("Media Technologies and Public Culture");
        }
        if(course_object.ocw){
            reqs.push("Organization, Communication, and Work");
        }
        if(course_object.raa){
            reqs.push("Rhetoric, Activism, and Advocacy");
        }
        if(course_object.m){
            reqs.push("Modes of Inquiry");
        }
        if(course_object.r){
            reqs.push("Representation Identity and Difference");
        }
        if(course_object.ideas.includes("FY-SEMINAR")){
            reqs.push("First-year Seminar");
        }
        if(course_object.ideas.includes("COMMBEYOND")){
            reqs.push("Communication Beyond Carolina");
        }
        return reqs;
    }

    getCourseReqs(){
        let rv = [];
        for (const req of requirements.keys()){
            if ((req === "COMMBEYOND" || req === "FY_SEMINAR") && this.ideas.includes(req)){
                rv.push(req);
            }
            else if (req === "lower" && this.number < 400){
                rv.push(req);
            }
            else if (req === "upper" && this.number >= 400){
                rv.push(req);
            }
            else if (this[req] === true){
                rv.push(req);
            }
        }
        return rv;
    }
}   