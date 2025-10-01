import CourseOffering from "./Classes/CourseOffering.js";
import { state } from "./Classes/State.js";

export function handleImport(event){
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for(const file of files){
        if (file.type === "application/json"){
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    const restored = data.map(obj => CourseOffering.fromJSON(obj));
                    state.courseOfferings.push(...restored);
                } catch (err) {
                    console.error("Invalid JSON file:", err);
                }
            };
            reader.readAsText(file);   
        }
    }
}