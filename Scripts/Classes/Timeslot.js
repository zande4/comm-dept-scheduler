export default class Timeslot{
    constructor(id, dayCompatability, start, end){
        this.id = id;
        this.dayCompatability = dayCompatability;
        this.start = start;
        this.end = end;
    }

    toStr(){
        let [hour, minute] = this.start.split(':').map(Number);
        let ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        const startStr = `${hour}:${minute.toString().padStart(2, '0')}${ampm}`;
        [hour, minute] = this.end.split(':').map(Number);
        ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        const endStr =  `${hour}:${minute.toString().padStart(2, '0')}${ampm}`;
        return startStr + " - " + endStr;
    }
}