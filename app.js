let names = [
    { name: 'hiking', weather: false, color: getRandomColor() },
    { name: 'kayaking', weather: false, color: getRandomColor() }
];
let filterWeather = false;

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let startAngle = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    updateNameList();
    drawWheel();
});

function addName() {
    const nameInput = document.getElementById('nameInput');
    const weatherInput = document.getElementById('weatherInput');
    const name = nameInput.value.trim();
    const weather = weatherInput.checked;

    if (name) {
        names.push({ name: name, weather: weather, color: getRandomColor() });
        nameInput.value = '';
        weatherInput.checked = false; // Reset the weather checkbox
        updateNameList();
        drawWheel();
    }
}

function removeName(index) {
    names.splice(index, 1);
    updateNameList();
    drawWheel();
}

function toggleWeather(index) {
    names[index].weather = !names[index].weather;
    updateNameList();
}

function updateNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = '';
    const filteredNames = filterWeather ? names.filter(name => name.weather) : names;
    filteredNames.forEach((nameObj, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${nameObj.name}</span>
            <input type="checkbox" class="weather-checkbox" ${nameObj.weather ? 'checked' : ''} onclick="toggleWeather(${index})">
        `;
        li.onclick = (e) => {
            if (e.target.tagName !== 'INPUT') {
                removeName(index);
            }
        };
        nameList.appendChild(li);
    });
    console.log('Updated name list:', filteredNames);
}

function drawWheel() {
    const filteredNames = filterWeather ? names.filter(name => name.weather) : names;
    const numSegments = filteredNames.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    filteredNames.forEach((nameObj, index) => {
        const angle = startAngle + index * anglePerSegment;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + anglePerSegment);
        ctx.fillStyle = nameObj.color;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(nameObj.name, canvas.width / 2 - 10, 0);
        ctx.restore();
    });
    console.log('Wheel drawn with names:', filteredNames);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function spin() {
    const filteredNames = filterWeather ? names.filter(name => name.weather) : names;
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
            const numSegments = filteredNames.length;
            const anglePerSegment = (2 * Math.PI) / numSegments;
            const selectedSegment = Math.floor((startAngle + Math.PI / 2) / anglePerSegment) % numSegments;
            alert(`The selected name is: ${filteredNames[selectedSegment].name}`);
        }
    }, interval);
}

function toggleWeatherFilter() {
    filterWeather = document.getElementById('weatherFilter').checked;
    updateNameList();
    drawWheel();
}
