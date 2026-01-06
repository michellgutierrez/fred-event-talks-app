function parseTime(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period === 'AM' && hours === 12) {
        hours = 0; // Midnight
    }
    return { hours, minutes };
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

function addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
}

function generateSchedule(talks, eventStartTime, lunchDurationMinutes, transitionDurationMinutes) {
    const schedule = [];
    let currentDateTime = new Date();
    const { hours, minutes } = parseTime(eventStartTime);
    currentDateTime.setHours(hours, minutes, 0, 0); // Set start time, clear seconds/ms

    // Sort talks by ID to ensure consistent ordering if needed
    talks.sort((a, b) => a.id.localeCompare(b.id));

    // Schedule 3 talks before lunch
    for (let i = 0; i < 3; i++) {
        const talk = talks[i];
        if (!talk) continue;

        const startTime = formatTime(currentDateTime);
        addMinutes(currentDateTime, talk.durationMinutes);
        const endTime = formatTime(currentDateTime);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime,
            endTime
        });

        if (i < 2) { // Add transition after first two talks
            const transitionStartTime = formatTime(currentDateTime);
            addMinutes(currentDateTime, transitionDurationMinutes);
            const transitionEndTime = formatTime(currentDateTime);
            schedule.push({
                type: 'break',
                name: 'Transition',
                startTime: transitionStartTime,
                endTime: transitionEndTime,
                durationMinutes: transitionDurationMinutes
            });
        }
    }

    // Add lunch break
    const lunchStartTime = formatTime(currentDateTime);
    addMinutes(currentDateTime, lunchDurationMinutes);
    const lunchEndTime = formatTime(currentDateTime);
    schedule.push({
        type: 'break',
        name: 'Lunch Break',
        startTime: lunchStartTime,
        endTime: lunchEndTime,
        durationMinutes: lunchDurationMinutes
    });

    // Add transition after lunch
    const postLunchTransitionStartTime = formatTime(currentDateTime);
    addMinutes(currentDateTime, transitionDurationMinutes);
    const postLunchTransitionEndTime = formatTime(currentDateTime);
    schedule.push({
        type: 'break',
        name: 'Transition',
        startTime: postLunchTransitionStartTime,
        endTime: postLunchTransitionEndTime,
        durationMinutes: transitionDurationMinutes
    });

    // Schedule 3 talks after lunch
    for (let i = 3; i < 6; i++) {
        const talk = talks[i];
        if (!talk) continue;

        const startTime = formatTime(currentDateTime);
        addMinutes(currentDateTime, talk.durationMinutes);
        const endTime = formatTime(currentDateTime);

        schedule.push({
            type: 'talk',
            ...talk,
            startTime,
            endTime
        });

        if (i < 5) { // Add transition after first two talks post-lunch
            const transitionStartTime = formatTime(currentDateTime);
            addMinutes(currentDateTime, transitionDurationMinutes);
            const transitionEndTime = formatTime(currentDateTime);
            schedule.push({
                type: 'break',
                name: 'Transition',
                startTime: transitionStartTime,
                endTime: transitionEndTime,
                durationMinutes: transitionDurationMinutes
            });
        }
    }

    return schedule;
}

module.exports = { generateSchedule };
