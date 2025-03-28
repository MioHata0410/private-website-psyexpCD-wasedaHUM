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

document.addEventListener("keydown", function(event) {
    if (event.key === "f") {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});

const practiceTrials = [
    { d: 8, b: 6 }, { d: 9, b: 6_5 }, { d: 10, b: 7 }, { d: 11, b: 7_5 }, { d: 8, b: 6 }
];

const mainTrials = [
    { d: 8, b: 6 }, { d: 8, b: 6_5 }, { d: 8, b: 7 }, { d: 8, b: 7_5 },
    { d: 9, b: 6 }, { d: 9, b: 6_5 }, { d: 9, b: 7 }, { d: 9, b: 7_5 },
    { d: 10, b: 6 }, { d: 10, b: 6_5 }, { d: 10, b: 7 }, { d: 10, b: 7_5 },
    { d: 11, b: 6 }, { d: 11, b: 6_5 }, { d: 11, b: 7 }, { d: 11, b: 7_5 }
];

let trials = practiceTrials.slice();
let trialIndex = 0;
let allResponseTimes = [];
let keyPressListener;

function startExperiment() {
    trialIndex = 0;
    allResponseTimes = [];
    runTrial();
}

function runTrial() {
    if (trialIndex >= trials.length) {
        if (trials === practiceTrials) {
            alert("練習試行が終了しました。本番試行を開始します。");
            allResponseTimes = allResponseTimes.concat(responseTimes);
            trials = mainTrials.slice();
            trialIndex = 0;
            setTimeout(runTrial, 1000);
            return;
        } else {
            allResponseTimes = allResponseTimes.concat(responseTimes);
            saveResults();
            return;
        }
    }

    const videoData = trials[trialIndex];
    const videoElement = document.getElementById('stimulus-video');
    const fixationCross = document.getElementById('fixation-cross');

    // ③ 修正: 十字が表示されている間は動画を表示しない
    fixationCross.style.display = "block";
    setTimeout(() => {
        fixationCross.style.display = "none";

        setTimeout(() => { // 100ms 後に動画を表示
            videoElement.src = `videos/tunnel_d${videoData.d}_b${videoData.b}.mp4`.replace(".", "_");
            videoElement.play();

            const startTime = Date.now();
            keyPressListener = function (event) {
                if (event.code === 'Space') {
                    const reactionTime = Date.now() - startTime;
                    allResponseTimes.push({ d: videoData.d, b: videoData.b, time: reactionTime });
                    document.removeEventListener('keydown', keyPressListener);
                    setTimeout(runTrial, 1000);
                }
            };

            document.addEventListener('keydown', keyPressListener);

            setTimeout(() => {
                document.removeEventListener('keydown', keyPressListener);
                allResponseTimes.push({ d: videoData.d, b: videoData.b, time: "No response" });
                setTimeout(runTrial, 1000);
            }, 14000);

            trialIndex++;
        }, 100); // ここで動画再生を100ms遅らせる
    }, 1000); // 十字を1秒間表示
}

// ④ 修正: CSV を 1 回だけダウンロード
function saveResults() {
    let csvContent = "data:text/csv;charset=utf-8,d,b,time\n";
    allResponseTimes.forEach(row => {
        csvContent += `${row.d},${row.b},${row.time}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "experiment_results.csv");
    document.body.appendChild(link);
    link.click();
}
