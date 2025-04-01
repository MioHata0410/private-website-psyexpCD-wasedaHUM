document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const instructionScreen = document.getElementById("instruction-screen");
    const mainInstructionScreen = document.getElementById("main-instruction-screen");
    const practiceScreen = document.getElementById("practice-screen");
    const experimentScreen = document.getElementById("experiment-screen");
    const fixationCross = document.getElementById("fixation-cross");
    const stimulusVideoP = document.getElementById("stimulus-videoP");
    const stimulusVideo = document.getElementById("stimulus-video");
    const participantNameInput = document.getElementById("participant-name");
    const startButton = document.getElementById("start-button");
    const instructionButton = document.getElementById("instruction-button");
    const mainInstructionButton = document.getElementById("main-instruction-button");

    let trialIndexP = 0;
    let trialsP = [];
    let responseTimesP = [];
    let trialIndex = 0;
    let trials = [];
    let responseTimes = [];

    let startTime;
    let startTimeP;
    let trialTimeout;
    let trialTimeoutP; // 追加

    
    //ビデオの読み込み
    const videoNames = [
        "tunnel_d8_b6.mp4", "tunnel_d8_b6_5.mp4", "tunnel_d8_b7.mp4", "tunnel_d8_b7_5.mp4",
        "tunnel_d9_b6.mp4", "tunnel_d9_b6_5.mp4", "tunnel_d9_b7.mp4", "tunnel_d9_b7_5.mp4",
        "tunnel_d10_b6.mp4", "tunnel_d10_b6_5.mp4", "tunnel_d10_b7.mp4", "tunnel_d10_b7_5.mp4",
        "tunnel_d11_b6.mp4", "tunnel_d11_b6_5.mp4", "tunnel_d11_b7.mp4", "tunnel_d11_b7_5.mp4"
    ];
    
    //最初の画面
    startButton.addEventListener("click", () => {
        if (participantNameInput.value.trim() === "") {
            alert("名前を入力してください。");
            return;
        }
        startScreen.style.display = "none";
        instructionScreen.style.display = "block";
    });

    //練習試行教示文
    instructionButton.addEventListener("click", () => {
        instructionScreen.style.display = "none";
        startPractice();
    });

    //練習試行をスタートさせるための関数
    function startPractice() {
        trialsP = shuffleArray(videoNames).slice(0, 5);
        trialIndexP = 0;
        responseTimesP = [];
        showFixationAndPlayVideoP();
    }

    //練習試行のshowFixationAndPlayVide
    function showFixationAndPlayVideoP() {
        practiceScreen.style.display = "block";
        fixationCross.style.display = "block";
        setTimeout(() => {
            fixationCross.style.display = "none";
            playVideoP();
        }, 2000);
    }
    
    //練習試行キー入力
    function handleKeyPressP(event) {
        if (event.code === "Space") {
            clearTimeout(trialTimeoutP); // タイムアウトをクリア
            let responseTimeP = Date.now() - startTimeP;
            responseTimesP.push({ trial: trialsP[trialIndexP], time: responseTimeP });
            document.removeEventListener("keydown", handleKeyPressP);
            nextTrialP();
        }
    }
    
    //練習試行playVideo
    function playVideoP() {        
        stimulusVideoP.src = `videos/${trialsP[trialIndexP]}`;
        stimulusVideoP.load();
        stimulusVideoP.play();
        startTimeP = Date.now();

        document.removeEventListener("keydown", handleKeyPressP); // ← 重複を防ぐ
        document.addEventListener("keydown", handleKeyPressP);
        trialTimeoutP = setTimeout(nextTrialP, 14000); // 最大14秒で次の試行へ
    }

    //練習試行ネクストトライアル
    function nextTrialP() {
        trialIndexP++;
        if (trialIndexP < trialsP.length) {
                fixationCross.style.display = "block";
                showFixationAndPlayVideoP();
        } else {
            practiceScreen.style.display = "none";  // ← 練習画面を非表示
            mainInstructionScreen.style.display = "block";
            mainInstructionButton.style.display = "block";
            mainInstructionButton.disabled = false;  // ← 念のため有効化
        }
    }

    //本番試行教示文
    mainInstructionButton.addEventListener("click", () => {
        mainInstructionScreen.style.display = "none";
        startExperiment();
    });
    
    //本番試行をスタートさせるための関数
    function startExperiment() {
        trials = shuffleArray(videoNames);
        trialIndex = 0;
        responseTimes = [];
        showFixationAndPlayVideo();
    }

    //本番試行のshowFixationAndPlayVide
    function showFixationAndPlayVideo() {
        experimentScreen.style.display = "block";
        fixationCross.style.display = "block";
        setTimeout(() => {
            fixationCross.style.display = "none";
            playVideo();
        }, 2000);
    }
 
    //本番試行キー入力
    function handleKeyPress(event) {
        if (event.code === "Space") {
            clearTimeout(trialTimeout); // タイムアウトをクリア
            let responseTime = Date.now() - startTimeP;
            responseTimes.push({ trial: trials[trialIndex], time: responseTime });
            document.removeEventListener("keydown", handleKeyPress);
            nextTrial();
        }
    }
     
    //本番試行playVideo
    function playVideo() {        
        stimulusVideo.src = `videos/${trials[trialIndex]}`;
        stimulusVideo.load();
        stimulusVideo.play();
        startTime = Date.now();
        
        document.removeEventListener("keydown", handleKeyPress); // ← 重複を防ぐ
        document.addEventListener("keydown", handleKeyPress);
        trialTimeout = setTimeout(nextTrial, 14000); // 最大14秒で次の試行へ
    }
    // function playVideo() {
    //     console.log("Playing video:", trials[trialIndex]);  // どの動画が選ばれているか
    //     stimulusVideo.src = `videos/${trials[trialIndex]}`;
    //     console.log("Video source set to:", stimulusVideo.src);
    
    //     stimulusVideo.load();
    //     stimulusVideo.addEventListener("loadeddata", () => {
    //         console.log("Video loaded successfully.");
    //     });

    //     stimulusVideo.play().then(() => {
    //         console.log("Video is playing.");
    //     }).catch(error => {
    //         console.error("Error playing video:", error);
    //     });

    //     startTime = Date.now();
    //     document.removeEventListener("keydown", handleKeyPress); 
    //     document.addEventListener("keydown", handleKeyPress);
    //     console.log("Key event added");

    //     trialTimeout = setTimeout(nextTrial, 14000);
    // }

    function nextTrial() {
        trialIndex++;
        if (trialIndex < trials.length) {
                fixationCross.style.display = "block";
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
