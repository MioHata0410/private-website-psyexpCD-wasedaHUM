<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>タウを体験してみよう</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="start-screen">
        <h1>タウを体験してみよう</h1>
        <label for="participant-name">氏名を入力してください：</label>
        <input type="text" id="participant-name" required>
        <button id="start-button">開始</button>
    </div>
    
    <div id="experiment-screen" style="display: none;">
        <h2 id="instruction">実験中...</h2>
        <video id="stimulus-video" width="800" autoplay></video>
        <div id="fixation-cross" style="display: none;">+</div>
    </div>
    
    <script src="tau.js"></script>
    <script>
        document.getElementById('start-button').addEventListener('click', function() {
            const name = document.getElementById('participant-name').value.trim();
            if (name) {
                localStorage.setItem('participantName', name);
                document.getElementById('start-screen').style.display = 'none';
                document.getElementById('experiment-screen').style.display = 'block';
                startExperiment();
            } else {
                alert('氏名を入力してください');
            }
        });

        function startExperiment() {
            const videos = [
                { d: 8, b: 6.0 }, { d: 8, b: 6.5 }, { d: 8, b: 7.0 }, { d: 8, b: 7.5 },
                { d: 9, b: 6.0 }, { d: 9, b: 6.5 }, { d: 9, b: 7.0 }, { d: 9, b: 7.5 },
                { d: 10, b: 6.0 }, { d: 10, b: 6.5 }, { d: 10, b: 7.0 }, { d: 10, b: 7.5 },
                { d: 11, b: 6.0 }, { d: 11, b: 6.5 }, { d: 11, b: 7.0 }, { d: 11, b: 7.5 }
            ];
            let trialIndex = 0;
            let responseTimes = [];
            
            function runTrial() {
                if (trialIndex >= videos.length) {
                    saveResults();
                    return;
                }
                
                const videoData = videos[trialIndex];
                const videoElement = document.getElementById('stimulus-video');
                const startTime = Date.now();
                
                videoElement.src = `videos/tunnel_d${videoData.d}_b${videoData.b}.mp4`;
                videoElement.play();
                
                function onKeyPress(event) {
                    if (event.code === 'Space') {
                        const reactionTime = Date.now() - startTime;
                        responseTimes.push({ d: videoData.d, b: videoData.b, time: reactionTime });
                        document.removeEventListener('keydown', onKeyPress);
                        setTimeout(runTrial, 1000);
                    }
                }
                document.addEventListener('keydown', onKeyPress);
                
                setTimeout(() => {
                    document.removeEventListener('keydown', onKeyPress);
                    runTrial();
                }, 14000);
                
                trialIndex++;
            }
            runTrial();
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
    </script>
</body>
</html>
