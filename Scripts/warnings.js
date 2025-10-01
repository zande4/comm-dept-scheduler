
function isConflictingClassroomUsage(){
    //returns false if no conflicting usage, returns an array of conflicting CourseOffering pairs otherwise
    let classSortedCourses = new Map();
    let classroom;
    let rv = [];
    //sort all course offerings by classroom
    for(const course of courseOfferings){
        classroom = course.classroom_select;
        if (classroom && classSortedCourses.has(classroom)){
            classSortedCourses.getValue(classroom).push(course);
        }
        else if (classroom){
            classSortedCourses.setValue(classroom, []);
        }
    }
    //check if any of the course offerings within a classroom group have overlapping times
    for (const cr of classSortedCourses.keys()){
        const courses = classSortedCourses.getValue(cr);
        for (let i = 0; i < courses.length; i++){
            for (let j = 0; j < courses.length; j++){
                let iEnd = parseTimeToMinutes(courses[i].day_time[courses[i].selected_time].time.end);
                let jStart = parseTimeToMinutes(courses[j].day_time[courses[j].selected_time].time.start);
                if (i != j && !(iEnd < jStart)){
                    rv.push([courses[i], courses[j]]);
                }
            }
        }
    }

    return rv;
}

function classroomOverlapToString(overlapArray){
    //given the array returned by isConflictingClassroomUsage will generate an array of conflict error messages;
    rv = [];
    for (const classroom of overlapArray){
        let c1 = "COMM" + classroom[0].number;
        let c2 = "COMM" + classroom[1].number;
        rv.push("There is overlapping classroom usage between " + c1 + "and" + c2);
    }
}