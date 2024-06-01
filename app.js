let names = [];
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let startAngle = 0;

function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name) {
        names.push(name);
        nameInput.value = '';
        updateNameList();
        drawWheel();
    }
}

function removeName(index) {
    names.splice(index, 1);
    updateNameList();
    drawWheel();
}

function updateNameList() {
    const nameList = document.getElementById('nameList');
    nameList.innerHTML = '';
    names.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = name;
        li.onclick = () => removeName(index);
        nameList.appendChild(li);
    });
}

function drawWheel() {
    const numSegments = names.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, index) => {
        const angle = startAngle + index * anglePerSegment;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + anglePerSegment);
        ctx.fillStyle = getRandomColor();
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(name, canvas.width / 2 - 10, 0);
        ctx.restore();
    });
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
            const numSegments = names.length;
            const anglePerSegment = (2 * Math.PI) / numSegments;
            const selectedSegment = Math.floor((startAngle + Math.PI / 2) / anglePerSegment) % numSegments;
            alert(`The selected name is: ${names[selectedSegment]}`);
        }
    }, interval);
}
