class Schedule {
    constructor(description, startTime, pathNumber) {
        this.description = description;
        this.startTime = this.parseTime(startTime);
        this.pathNumber = pathNumber;
        this.endTime = this.startTime; 
    }

    parseTime(timeString) {
        const now = new Date();
        const [hours, minutes] = timeString.split(':').map(Number);
        now.setHours(hours, minutes, 0, 0);
        return now;
    }

    overlapsWith(otherSchedule) {
        return this.startTime < otherSchedule.endTime && this.endTime > otherSchedule.startTime;
    }
}

class PrintSchedule {
    constructor() {
        this.scheduleData = [];
        this.maxSchedules = 20;
        this.maxPaths = 3;
    }

    addSchedule(description, startTime, pathNumber) {
        const newSchedule = new Schedule(description, startTime, pathNumber);

        const blocks = { path_cost: [10, 20, 30] };

        if (pathNumber !== 0) {
            const travelTime = blocks.path_cost[pathNumber - 1];
            const startTimeBeforeTravel = new Date(newSchedule.startTime.getTime() - travelTime * 60000);
            newSchedule.endTime = newSchedule.startTime; 
            newSchedule.startTime = startTimeBeforeTravel; 
        }

        for (let schedule of this.scheduleData) {
            if (newSchedule.overlapsWith(schedule)) {
                alert('Schedule time conflicts with an existing schedule');
                return;
            }
        }

        if (pathNumber !== 0 && (!blocks.path_cost || blocks.path_cost[pathNumber - 1] === 0)) {
            alert('Selected path is not set');
            return;
        }

        if (this.scheduleData.length >= this.maxSchedules) {
            alert('Maximum number of schedules reached');
            return;
        }

        this.scheduleData.push(newSchedule);
        this.scheduleData.sort((a, b) => a.startTime - b.startTime);
        this.displaySchedules();
    }

    displaySchedules() {
        const scheduleContainer = document.getElementById('schedule_data');
        scheduleContainer.innerHTML = ''; 

        this.scheduleData.forEach((schedule, index) => {
            const scheduleElement = document.createElement('div');
            scheduleElement.className = 'schedule_data';
            scheduleElement.style.transform = `translateY(${index * 20}px)`;
            scheduleElement.style.overflow = 'hidden';
            scheduleElement.style.textOverflow = 'ellipsis';
            scheduleElement.style.whiteSpace = 'nowrap';


            let content = `${this.shortenText(schedule.description, 20)}<br>Start Time<br>${schedule.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            if (schedule.pathNumber !== 0) {
                const blocks = { path_cost: [10, 20, 30] };
                const travelTime = blocks.path_cost[schedule.pathNumber - 1];
                content += `<br>Travel Time<br>${travelTime} minutes<br>End Time<br>${schedule.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }

            scheduleElement.innerHTML = content;
            scheduleContainer.appendChild(scheduleElement);
        });
    }

    shortenText(text, maxLength) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }

    removeExpiredSchedules() {
        const now = new Date().getTime();
        this.scheduleData = this.scheduleData.filter(schedule => schedule.endTime.getTime() > now);
        this.displaySchedules();
    }
}

const printSchedule = new PrintSchedule();

document.getElementById('schedule_form').addEventListener('submit', function(event) {
    event.preventDefault();

    const description = document.querySelector('.description').value;
    const startTime = document.querySelector('.sc_data').value;
    const pathNumber = parseInt(document.querySelector('.path_num').value, 10);

    if (!description || !startTime) {
        alert('Please fill in all fields');
        return;
    }

    printSchedule.addSchedule(description, startTime, pathNumber);
    printSchedule.removeExpiredSchedules();
});

setInterval(() => {
    printSchedule.removeExpiredSchedules();
}, 60000);

printSchedule.removeExpiredSchedules();