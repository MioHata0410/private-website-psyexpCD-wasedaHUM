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
    <div id="instruction-screen" style="display: none;">
        <h2 id="instruction-title">練習試行</h2>
        <p id="instruction-text">
            この実験では、以下のような課題を行っていただきます：<br>
            1. 白い線で構成された直線のダクトの中を前進する映像が表示されます。<br>
            2. 映像開始から5秒後、ダクトの途中に白い壁が現れます。<br>
            3. その後、ある時点で画面が暗転します。<br>
            4. 暗転後、あなたが壁に「ぶつかる」と感じたタイミングでスペースキーを押してください。<br><br>
            まずは5回の練習試行を行います。実験の流れに慣れていただくための練習ですので、リラックスして取り組んでください。<br><br>
            <b>注意事項：</b><br>
            * 画面の中央を注視してください。<br>
            * できるだけ自然な反応を心がけてください。<br>
            * 疲れを感じたら適宜休憩を取ってください。
        </p>
        <button id="instruction-button">次へ</button>
    </div>
    
    <div id="experiment-screen" style="display: none;">
        <video id="stimulus-video" height="900" autoplay></video>
        <div id="fixation-cross" style="display: none;">+</div>
    </div>
    
  
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
