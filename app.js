function spin() {
    const spins = Math.floor(Math.random() * 10) + 5;
    const spinTime = 3000;
    const spinAngleStart = Math.random() * 10 + 10;
    const spinAngleEnd = Math.random() * 10 + 5;

    let currentAngle = startAngle;
    let currentTime = 0;
    const interval = 30;

    const spinInterval = setInterval(() => {
        currentTime += interval;
        const spinProgress = currentTime / spinTime;
        const easeInOut = (t) => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const angleDelta = easeInOut(spinProgress) * (spinAngleEnd - spinAngleStart) + spinAngleStart;
        currentAngle += angleDelta;
        startAngle = currentAngle % (2 * Math.PI);
        drawWheel();

        if (currentTime >= spinTime) {
            clearInterval(spinInterval);
            const selectedSegment = Math.floor((startAngle + Math.PI / 2) / (2 * Math.PI / names.length)) % names.length;
            const selectedName = names[selectedSegment].name;
            alert(`The selected name is: ${selectedName}`);
            saveChosenName(selectedName);
        }
    }, interval);
}

function toggleWeatherFilter() {
    const weatherFilterCheckbox = document.getElementById('weatherFilter');
    const filteredNames = names.filter(nameObj => {
        return weatherFilterCheckbox.checked ? nameObj.weather === true : true;
    });

    if (filteredNames.length !== names.length) {
        names = filteredNames;
        drawWheel();
    } else {
        console.log('No filtering needed. All names are weather-compatible.');
    }
}
