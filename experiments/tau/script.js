document.getElementById('start-button').addEventListener('click', function () {
    const name = document.getElementById('participant-name').value.trim();
    if (name) {
        localStorage.setItem('participantName', name);
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('instruction-screen').style.display = 'block';
    } else {
        alert('氏名を入力してください');
    }
});

document.getElementById('instruction-button').addEventListener('click', function () {
    document.getElementById('instruction-screen').style.display = 'none';
    document.getElementById('experiment-screen').style.display = 'block';
    startExperiment();
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

let trials = practiceTrials.slice(); // 最初は練習試行
let trialIndex = 0;
let responseTimes = [];
let keyPressListener;

function startExperiment() {
    trialIndex = 0;
    responseTimes = [];
    runTrial();
}

function runTrial() {
    if (trialIndex >= trials.length) {
        if (trials === practiceTrials) {
            alert("練習試行が終了しました。本番試行を開始します。");
            trials = mainTrials.slice(); // 本番試行に切り替え
            trialIndex = 0;
            setTimeout(runTrial, 1000);
            return;
        } else {
            saveResults();
            return;
        }
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
            setTimeout(runTrial, 1000);
        }
    };

    document.addEventListener('keydown', keyPressListener);

    setTimeout(() => {
        document.removeEventListener('keydown', keyPressListener);
        responseTimes.push({ d: videoData.d, b: videoData.b, time: "No response" });
        setTimeout(runTrial, 1000);
    }, 14000);

    trialIndex++;
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
