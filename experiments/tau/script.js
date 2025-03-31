document.getElementById('start-button').addEventListener('click', function () {
    document.getElementById('instruction-screen').style.display = 'none';
    document.getElementById('experiment-screen').style.display = 'block';
    startExperiment();
});

document.getElementById('main-instruction-button').addEventListener('click', function () {
    document.getElementById('main-instruction-screen').style.display = 'none';
    document.getElementById('experiment-screen').style.display = 'block';
    startMainExperiment();
});

const practiceTrials = [
    { d: 8, b: 6.0 }, { d: 9, b: 6.5 }, { d: 10, b: 7.0 }, { d: 11, b: 7.5 }, { d: 8, b: 6.5 }
];

const mainTrials = [
    { d: 8, b: 6.0 }, { d: 8, b: 6.5 }, { d: 8, b: 7.0 }, { d: 8, b: 7.5 },
    { d: 9, b: 6.0 }, { d: 9, b: 6.5 }, { d: 9, b: 7.0 }, { d: 9, b: 7.5 },
    { d: 10, b: 6.0 }, { d: 10, b: 6.5 }, { d: 10, b: 7.0 }, { d: 10, b: 7.5 },
    { d: 11, b: 6.0 }, { d: 11, b: 6.5 }, { d: 11, b: 7.0 }, { d: 11, b: 7.5 }
];

let trials, trialIndex, responseTimes, keyPressListener;

function startExperiment() {
    trials = [...practiceTrials];
    trialIndex = 0;
    responseTimes = [];
    runTrial();
}

function startMainExperiment() {
    trials = [...mainTrials, ...mainTrials, ...mainTrials];
    shuffleArray(trials);
    trialIndex = 0;
    responseTimes = [];
    runTrial();
}

function runTrial() {
    if (trialIndex >= trials.length) {
        if (trials.length === practiceTrials.length) {
            document.getElementById('experiment-screen').style.display = 'none';
            document.getElementById('main-instruction-screen').style.display = 'block';
            return;
        }
        saveResults();
        return;
    }

    const videoData = trials[trialIndex];
    const videoElement = document.getElementById('stimulus-video');
    const startTime = Date.now();

    videoElement.src = `videos/tunnel_d${videoData.d}_b${videoData.b}.mp4`;
    videoElement.play();

    keyPressListener = function (event) {
        if (event.code === 'Space') {
            const reactionTime = Date.now() - startTime;
            responseTimes.push({ d: videoData.d, b: videoData.b, time: reactionTime });
            document.removeEventListener('keydown', keyPressListener);
            trialIndex++;
            setTimeout(runTrial, 1000);
        }
    };
    
    document.addEventListener('keydown', keyPressListener);
    setTimeout(() => {
        document.removeEventListener('keydown', keyPressListener);
        responseTimes.push({ d: videoData.d, b: videoData.b, time: "No response" });
        trialIndex++;
        setTimeout(runTrial, 1000);
    }, 14000);
}

function saveResults() {
    let csvContent = "data:text/csv;charset=utf-8,d,b,time\n";
    responseTimes.forEach(row => {
        csvContent += `${row.d},${row.b},${row.time}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "experiment_results.csv");
    document.body.appendChild(link);
    link.click();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
