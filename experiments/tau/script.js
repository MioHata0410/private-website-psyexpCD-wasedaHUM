document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const instructionScreen = document.getElementById("instruction-screen");
    const mainInstructionScreen = document.getElementById("main-instruction-screen");
    const practiceScreen = document.getElementById("practice-screen");
    const experimentScreen = document.getElementById("experiment-screen");
    const fixationCross = document.getElementById("fixation-cross");
    const stimulusVideo = document.getElementById("stimulus-video");
    const participantNameInput = document.getElementById("participant-name");
    const startButton = document.getElementById("start-button");
    const instructionButton = document.getElementById("instruction-button");
    const mainInstructionButton = document.getElementById("main-instruction-button");

    let trialIndex = 0;
    let trials = [];
    let responseTimes = [];
    let startTime;
    let trialTimeout;
    
    const videoNames = [
        "tunnel_d8_b6.mp4", "tunnel_d8_b6_5.mp4", "tunnel_d8_b7.mp4", "tunnel_d8_b7_5.mp4",
        "tunnel_d9_b6.mp4", "tunnel_d9_b6_5.mp4", "tunnel_d9_b7.mp4", "tunnel_d9_b7_5.mp4",
        "tunnel_d10_b6.mp4", "tunnel_d10_b6_5.mp4", "tunnel_d10_b7.mp4", "tunnel_d10_b7_5.mp4",
        "tunnel_d11_b6.mp4", "tunnel_d11_b6_5.mp4", "tunnel_d11_b7.mp4", "tunnel_d11_b7_5.mp4"
    ];
    
    startButton.addEventListener("click", () => {
        if (participantNameInput.value.trim() === "") {
            alert("名前を入力してください。");
            return;
        }
        startScreen.style.display = "none";
        instructionScreen.style.display = "block";
    });

    instructionButton.addEventListener("click", () => {
        instructionScreen.style.display = "none";
        startPractice();
    });

    function startPractice() {
        trials = shuffleArray(videoNames).slice(0, 5);
        trialIndex = 0;
        responseTimes = [];
        showFixationAndPlayVideo();
    }
    
    mainInstructionButton.addEventListener("click", () => {
        mainInstructionScreen.style.display = "none";
        startExperiment();
    });
    
    function showFixationAndPlayVideo() {
        experimentScreen.style.display = "block";
        fixationCross.style.display = "block";
        setTimeout(() => {
            fixationCross.style.display = "none";
            playVideo();
        }, 2000);
    }

    function startExperiment() {
        trials = shuffleArray([...videoNames]);
        trialIndex = 0;
        responseTimes = [];
        showFixationAndPlayVideo();
    }

    function playVideo() {
        if (trialIndex >= trials.length) {
            endExperiment();
            return;
        }
        
        stimulusVideo.src = `videos/${trials[trialIndex]}`;
        stimulusVideo.load();
        stimulusVideo.play();
        startTime = Date.now();
        
        document.addEventListener("keydown", handleKeyPress);
        trialTimeout = setTimeout(nextTrial, 14000); // 最大14秒で次の試行へ
    }

    function handleKeyPress(event) {
        if (event.code === "Space") {
            clearTimeout(trialTimeout); // タイムアウトをクリア
            let responseTime = Date.now() - startTime;
            responseTimes.push({ trial: trials[trialIndex], time: responseTime });
            document.removeEventListener("keydown", handleKeyPress);
            nextTrial();
        }
    }

    function nextTrial() {
        trialIndex++;
        if (trialIndex < trials.length) {
            showFixationAndPlayVideo();
        } else {
            endExperiment();
        }
    }

    function endExperiment() {
        console.log("Experiment finished", responseTimes);
        alert("実験終了。データを保存してください。");
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
