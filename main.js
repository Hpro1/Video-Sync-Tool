var player1, player2;
var player1Type = 'youtube'; // Possible values: 'youtube', 'html5'
var player2Type = 'youtube'; // Possible values: 'youtube', 'html5'
var layoutIsToggled = false;

document.getElementById('toggle').addEventListener('click', function() {
    var videoSlots = document.querySelectorAll('.video-slot');

    if (!layoutIsToggled) {
        videoSlots.forEach(function(slot) {
            slot.style.position = 'absolute';
            slot.style.opacity = '0.5';
            slot.style.width = '70%';
            slot.style.height = '100%';
        });
    } else {
        videoSlots.forEach(function(slot) {
            slot.style.position = 'static';
            slot.style.opacity = '1';
            slot.style.width = '100%';
            slot.style.height = 'auto';
        });
    }

    layoutIsToggled = !layoutIsToggled;
});

function onYouTubeIframeAPIReady() {
  player1 = new YT.Player('video1', {
    playerVars: {
      'autoplay': 0,
    },
    events: {
      'onReady': onPlayerReady,
    }
  });

  player2 = new YT.Player('video2', {
    playerVars: {
      'autoplay': 0,
    },
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  // Handle player ready event if necessary
}

document.getElementById('youtubeLink1').addEventListener('change', function() {
  var videoId = this.value.split('v=')[1];
  player1.cueVideoById(videoId);
  player1Type = 'youtube';
});

document.getElementById('youtubeLink2').addEventListener('change', function() {
  var videoId = this.value.split('v=')[1];
  player2.cueVideoById(videoId);
  player2Type = 'youtube';
});

document.getElementById('fileUpload1').addEventListener('change', function() {
  var file = this.files[0];
  createFileVideo(file, 1);
});

document.getElementById('fileUpload2').addEventListener('change', function() {
  var file = this.files[0];
  createFileVideo(file, 2);
});

function createFileVideo(file, slotNumber) {
  const video = document.createElement('video');
  video.src = URL.createObjectURL(file);
  video.controls = true;
  video.style.width = '100%';
  video.style.height = '100%';
  
  const wrapper = document.querySelector(`.video-slot:nth-of-type(${slotNumber}) .video-wrapper`);
  wrapper.innerHTML = '';
  wrapper.appendChild(video);

  if(slotNumber === 1) {
    player1 = video;
    player1Type = 'html5';
  } else if(slotNumber === 2) {
    player2 = video;
    player2Type = 'html5';
  }
}

function playPauseVideo(player, playerType) {
    if (playerType === 'youtube') {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    } else { // HTML5 video
        if (player.paused) {
            player.play();
        } else {
            player.pause();
        }
    }
}

function syncVideos(sourcePlayer, sourcePlayerType, targetPlayer, targetPlayerType) {
    var currentTimestamp;
    if (sourcePlayerType === 'youtube') {
        currentTimestamp = sourcePlayer.getCurrentTime();
    } else { // HTML5 video
        currentTimestamp = sourcePlayer.currentTime;
    }

    if (targetPlayerType === 'youtube') {
        targetPlayer.seekTo(currentTimestamp);
    } else { // HTML5 video
        targetPlayer.currentTime = currentTimestamp;
    }
}

document.getElementById('playPause').addEventListener('click', function() { 
    playPauseVideo(player1, player1Type);
    playPauseVideo(player2, player2Type);
    updatePlayPauseButton();
});

document.getElementById('sync1').addEventListener('click', function() {
    syncVideos(player1, player1Type, player2, player2Type);
});

document.getElementById('sync2').addEventListener('click', function() {
    syncVideos(player2, player2Type, player1, player1Type);
});

function updatePlayPauseButton() {
    var isPlaying = false;
    
    if (player1Type === 'youtube') {
        isPlaying = player1.getPlayerState() === YT.PlayerState.PLAYING;
    } else { // HTML5 video
        isPlaying = !player1.paused;
    }
    
    if (player2Type === 'youtube') {
        isPlaying = isPlaying || player2.getPlayerState() === YT.PlayerState.PLAYING;
    } else { // HTML5 video
        isPlaying = isPlaying || !player2.paused;
    }
    
    var playPauseButton = document.getElementById('playPause');
    if (isPlaying) {
        playPauseButton.style.backgroundColor = "#45a049";
    } else {
        playPauseButton.style.backgroundColor = "#4caf50";
    }
}

document.getElementById('backward1').addEventListener('click', function() { 
  // 1 frame = 1 / frame rate
  // Assuming frame rate is 30 fps
  var currentTime = player1Type === 'youtube' ? player1.getCurrentTime() : player1.currentTime;
  var newTime = currentTime - 1/60;
  seekToTime(player1, player1Type, newTime);
});

document.getElementById('backward2').addEventListener('click', function() { 
  var currentTime = player2Type === 'youtube' ? player2.getCurrentTime() : player2.currentTime;
  var newTime = currentTime - 1/60;
  seekToTime(player2, player2Type, newTime);
});

document.getElementById('forward1').addEventListener('click', function() { 
  var currentTime = player1Type === 'youtube' ? player1.getCurrentTime() : player1.currentTime;
  var newTime = currentTime + 1/60;
  seekToTime(player1, player1Type, newTime);
});

document.getElementById('forward2').addEventListener('click', function() { 
  var currentTime = player2Type === 'youtube' ? player2.getCurrentTime() : player2.currentTime;
  var newTime = currentTime + 1/60;
  seekToTime(player2, player2Type, newTime);
});

document.getElementById('playPause1').addEventListener('click', function() { 
  playPauseVideo(player1, player1Type);
});

document.getElementById('playPause2').addEventListener('click', function() { 
  playPauseVideo(player2, player2Type);
});

function seekToTime(player, playerType, time) {
  if (playerType === 'youtube') {
      player.seekTo(time);
  } else { // HTML5 video
      player.currentTime = time;
  }
}
