var audio = document.getElementById("myAudio");
var songList = ["BelieveYourself.mp3", "LegendOfMermaid.mp3", "DarkBaroque.mp3", "TreasureOfLove.mp3", "RainbowNotes.mp3"];
var songName = ["相信自己", "七彩的微風", "黑暗的巴洛克", "愛的百寶箱", "RainbowNotes"];
//獲取狀態
var select = document.getElementById("musicPool");
var info = document.getElementById("bottomInfo");
var loopState = document.getElementById("midInfo");
var playState = document.getElementById("midInfo").children[1];
var musicInfo = document.getElementById("topInfo").children[0];
//獲取音樂
var progressBar = document.getElementById("progressBar");
var volControl = document.getElementById("volControl");
var range = volControl.children[1];
var text = volControl.children[3];
//獲取按鈕
var funcBtn = document.getElementById("funcBtn");
var play = funcBtn.children[0].children[0];
var Muted = funcBtn.children[1].children[0];
//CSS控制
var left = document.getElementById("left");
var rotate = left.children[2];
var shake = left.children[1];
var showBookBtn = document.getElementById("funcBtn").children[1].children[4];
var book = document.getElementById("book");
//預設播放第一首歌
var SongNum = 0;
audio.src = "music/" + songList[SongNum];
InitMusicPool();
audio.volume = 0.2;
var IntervalTaskID;


// audio.addEventListener('timeupdate', function() {
//         setMusicTime();
//         updateProgress();
// });

//建立選歌單
function InitMusicPool() {
    for (var i = 0; i < songList.length; i++) {
        var option = document.createElement("option");
        book.children[1].children[i].id = "song" + (i + 1);
        book.children[1].children[i].draggable = "true";
        book.children[1].children[i].ondragstart = drag;
        option.value = "music/" + songList[i];
        option.innerText = songName[i];
        select.appendChild(option);
        // changeMisic(0);
    }
}

//分秒的處理
function getMusicTime(t) {
    var M = Math.floor(t / 60);
    var S = Math.floor(t % 60);
    M = M < 10 ? "0" + M : M;
    S = S < 10 ? "0" + S : S;
    return M + " : " + S;
}
//整首&目前音樂時間
function setMusicTime() {
    info.children[1].innerText = getMusicTime(audio.duration);
    info.children[0].innerText = getMusicTime(audio.currentTime);
}

function playMisic() {
    audio.play();
    play.innerText = ";";
    play.onclick = pauseMusic;
    musicInfo.innerText = "NOW PLAYING";
    playState.innerText = songName[SongNum];
    play.dataset.title = "暫停"
    animation();

    IntervalTaskID = setInterval(function () {
        setMusicTime();
        updateProgress();
        getMusicStatus();
    }, 100);
}

function pauseMusic() {
    audio.pause();
    play.innerText = "4";
    play.onclick = playMisic;
    musicInfo.innerText = "PAUSE";
    play.dataset.title = "播放"
    removeanimation();
    clearInterval(IntervalTaskID);
}

function stopMisic() {
    pauseMusic();
    audio.currentTime = 0;
    setMusicTime();
    updateProgress();
    musicInfo.innerText = "NO PLAY";
}

function setMuted() {
    audio.muted = !audio.muted;
    Muted.style.color = audio.muted ? "rgb(250, 112, 112)" : "";
}
//快轉、倒轉
function changeTime(changeTime) {
    audio.currentTime += changeTime;
}
//音樂進度條上色
function updateProgressColor() {
    progressBar.style.backgroundImage = `linear-gradient(to left,
        rgb(255, 255, 255)${100 - progressBar.value / 10}%,
        rgba(255, 170, 161)${100 - progressBar.value / 10}%)`;
}
//滑鼠移動進度條
function setProgress() {
    audio.currentTime = audio.duration * progressBar.value / 1000;
    updateProgressColor();
}
//自動進度條
function updateProgress() {
    progressBar.value = audio.currentTime / audio.duration * 1000;
    updateProgressColor();
}

//音量條控制
function setVolumeByRangerBar() {
    audio.volume = range.value / 100;
    text.value = range.value;
    //音量進度條上色
    range.style.backgroundImage = `linear-gradient(to left,
        rgb(255, 255, 255)${100 - range.value}%,
        rgba(255, 170, 161)${100 - range.value}%)`;
}

function setVolume(setVolume) {
    range.value = parseInt(range.value) + setVolume;//轉字串為整數
    setVolumeByRangerBar();
    // var V = audio.volume += setVolume / 100;
    // range.value = parseInt(V * 100);
    // text.value = parseInt(V * 100);
}

//設定音樂清單
function musicPool() {
    switch (true) {
        case (SongNum >= songList.length):
            SongNum = 0;
            break;
        case (SongNum < 0):
            SongNum = songList.length - 1;
            break;
    }
    audio.src = select.children[SongNum].value;
    select.children[SongNum].selected = true;

    clearInterval(IntervalTaskID);
    if (play.innerText == ";") {
        audio.onloadeddata = playMisic();
    }
}
//上一首下一首
function changeMisic(num) {
    SongNum = select.selectedIndex + num;
    musicPool();
    playState.innerText = songName[SongNum];
}
//循環事件選擇
function setfuncBtnStatus(event) {
    for (var i = 1; i < funcBtn.children[1].children.length; i++) {
        funcBtn.children[1].children[i].style.color = "";
    }
    event.target.style.color = loopState.children[0].innerText != event.target.getAttribute('data-title') ? "rgb(250, 112, 112)" : "";
    loopState.children[0].innerText = loopState.children[0].innerText != event.target.getAttribute('data-title') ? event.target.getAttribute('data-title') : "";
    loopState.className = loopState.children[0].innerText != event.target.getAttribute('data-title') ? "" : "grow";
}
//我的歌單
function allowDrop(event) {
    event.preventDefault();//放棄物件預設行為
}
function drag(event) {
    event.dataTransfer.setData("Text", event.target.id);

}
function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    if (event.target.id == "")
        event.target.appendChild(document.getElementById(data));
    else
        event.target.parentNode.appendChild(document.getElementById(data));
}
//更新歌單
function updateMusic() {
    var droptarget = document.getElementById("book").children[2];
    songList = Array.from(droptarget.children).map(child => child.title);
    songName = Array.from(droptarget.children).map(child => child.innerText);

    //重製歌單
    select.innerHTML = "";
    for (var i = 0; i < droptarget.children.length; i++) {
        var option = document.createElement("option");
        option.value = "music/" + songList[i];
        option.innerText = songName[i];
        select.appendChild(option);
    }
    if (songList == "") alert("請至少選擇一首歌");
    SongNum = 0;
    audio.src = select.children[SongNum].value;
    changeMisic(0);
}

//增加動畫
function animation() {
    rotate.classList.add('rotate');
    shake.classList.add('shake');
}
function removeanimation() {
    rotate.classList.remove('rotate');
    shake.classList.remove('shake');
}

function showBook() {
    book.classList.add('show');
    showBookBtn.onclick = closeBook;
}

function closeBook() {
    book.classList.remove('show');
    showBookBtn.onclick = showBook;
}

//音樂結束的處理
function getMusicStatus() {
    if (audio.currentTime == audio.duration) {
        if (loopState.children[0].innerText == "單曲循環") {
            changeMisic(0);
        }
        else if (loopState.children[0].innerText == "隨機播放") {
            do {
                var r = Math.round(Math.random() * songList.length);
            } while (r == SongNum)
            r -= SongNum;
            changeMisic(r);
        }
        else if (loopState.children[0].innerText == "全曲循環") {
            SongNum += 1;
            musicPool();
        }
        else if (SongNum + 1 == songList.length) {
            pauseMusic();
            musicInfo.innerText = "MUSIC END";
        }
        else {
            changeMisic(1);
        }
    }
}
