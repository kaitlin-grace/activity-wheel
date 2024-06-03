

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBwMJBgT8o79WqIo_FenBxTnOZUMLN69mc",
    authDomain: "backend-activity-wheel.firebaseapp.com",
    projectId: "backend-activity-wheel",
    storageBucket: "backend-activity-wheel.appspot.com",
    messagingSenderId: "364459720561",
    appId: "1:364459720561:web:c08e03c746b08c642c00d0"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to initialize default names array
function initializeDefaultNames() {
    return [
        { name: 'hiking', weather: false, color: getRandomColor() },
        { name: 'kayaking', weather: false, color: getRandomColor() }
        // Add more default names here if needed
    ];
}

// Set initial names array using the initialize function
let names = initializeDefaultNames();

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
let startAngle = 0;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded and parsed');
    await loadNamesFromFirestore();
});

        
async function saveNamesToFirestore(defaultNames) {
    try {
        // Generate random colors and set weather values for default names
        const namesWithColorsAndWeather = defaultNames.map(nameObj => ({
            name: nameObj.name,
            weather: nameObj.weather,
            color: getRandomColor()
        }));

        const firestoreRef = doc(collection(db, 'names'), 'activityNames');
        console.log('Attempting to save names to Firestore:', namesWithColorsAndWeather);
        await setDoc(firestoreRef, { names: namesWithColorsAndWeather });
        console.log('Names saved to Firestore:', namesWithColorsAndWeather);
    } catch (error) {
        console.error('Error saving names to Firestore:', error);
        if (error.code === 'permission-denied') {
            console.error('Permission denied. Please check your Firestore security rules.');
        } else {
            console.error('An error occurred:', error);
        }
    }
}

        
async function loadNamesFromFirestore() {
    try {
        const docRef = doc(db, 'names', 'activityNames');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().names && docSnap.data().names.length > 0) {
            names = docSnap.data().names;
            console.log('Names loaded from Firestore:', names);
        } else {
            console.log('No document found in Firestore or names field is empty. Using default names.');
            // Save default names to Firestore
            await saveNamesToFirestore(names);
        }
        drawWheel(); // Draw the wheel after loading names
    } catch (error) {
        console.error('Error loading names from Firestore:', error);
    }
}



function drawWheel() {
    const numSegments = names.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((nameObj, index) => {
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
    console.log('Wheel drawn with names:', names);
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
            const selectedSegment = Math.floor((startAngle + Math.PI / 2) / (2 * Math.PI / names.length)) % names.length;
            const selectedName = names[selectedSegment].name;
            alert(`The selected name is: ${selectedName}`);
            saveChosenName(selectedName);
        }
    }, interval);
}

async function saveChosenName(name) {
    const chosenRef = db.collection('chosenNames').doc(name);
    const doc = await chosenRef.get();
    if (doc.exists) {
        const currentCount = doc.data().count;
        await chosenRef.update({ count: currentCount + 1 });
    } else {
        await chosenRef.set({ count: 1 });
    }
}
