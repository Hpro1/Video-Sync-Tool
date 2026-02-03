let player1, player2;
let player1Type = "youtube";
let player2Type = "youtube";

let zoom1 = false;
let zoom2 = false;

let objUrl1 = null;
let objUrl2 = null;

function bind(id, fn){
  const el = document.getElementById(id);
  if(el) el.onclick = fn;
}

/* YOUTUBE INIT */

function onYouTubeIframeAPIReady(){

  player1 = new YT.Player("video1", {
    playerVars:{ autoplay:0, mute:1 }
  });

  player2 = new YT.Player("video2", {
    playerVars:{ autoplay:0, mute:1 }
  });

}

/*  HELPERS*/

function extractYouTubeId(url){
  try{
    const u = new URL(url);

    if(u.hostname === "youtu.be")
      return u.pathname.slice(1);

    if(u.hostname.includes("youtube.com")){
      if(u.pathname === "/watch")
        return u.searchParams.get("v");

      return u.pathname.split("/").pop();
    }

  }catch{}

  return null;
}

function getTime(p,t){
  return t==="youtube" ? p.getCurrentTime() : p.currentTime;
}

function seek(p,t,time){
  if(time<0) time=0;
  if(t==="youtube") p.seekTo(time,true);
  else p.currentTime = time;
}

function play(p,t){
  if(t==="youtube") p.playVideo();
  else p.play();
}

function pause(p,t){
  if(t==="youtube") p.pauseVideo();
  else p.pause();
}

function togglePlay(p,t){
  if(t==="youtube"){
    if(p.getPlayerState()===1) p.pauseVideo();
    else p.playVideo();
  } else {
    if(p.paused) p.play();
    else p.pause();
  }
}

/* FILE LOAD */

function loadFile(file,slot){

  const video = document.createElement("video");
  video.controls = true;
  video.muted = true;

  if(slot===1){
    if(objUrl1) URL.revokeObjectURL(objUrl1);
    objUrl1 = URL.createObjectURL(file);
    video.src = objUrl1;

    player1 = video;
    player1Type = "html5";

    zoom1=false;
    video.classList.remove("zoomed");

  } else {

    if(objUrl2) URL.revokeObjectURL(objUrl2);
    objUrl2 = URL.createObjectURL(file);
    video.src = objUrl2;

    player2 = video;
    player2Type = "html5";

    zoom2=false;
    video.classList.remove("zoomed");
  }

  document.querySelector(`#slot${slot} .video-wrapper`).innerHTML="";
  document.querySelector(`#slot${slot} .video-wrapper`).appendChild(video);
}

/* INPUTS */

document.getElementById("youtubeLink1").onchange = e=>{
  const id = extractYouTubeId(e.target.value);
  if(id){ player1.cueVideoById(id); player1Type="youtube"; }
};

document.getElementById("youtubeLink2").onchange = e=>{
  const id = extractYouTubeId(e.target.value);
  if(id){ player2.cueVideoById(id); player2Type="youtube"; }
};

document.getElementById("fileUpload1").onchange = e=> loadFile(e.target.files[0],1);
document.getElementById("fileUpload2").onchange = e=> loadFile(e.target.files[0],2);

/*  BOTH SHIFT  */

function shiftBoth(sec){
  seek(player1,player1Type,getTime(player1,player1Type)+sec);
  seek(player2,player2Type,getTime(player2,player2Type)+sec);
}

/*  BUTTONS  */

bind("playPauseMain", ()=>{
  togglePlay(player1,player1Type);
  togglePlay(player2,player2Type);
});

bind("playPause1", ()=> togglePlay(player1,player1Type));
bind("playPause2", ()=> togglePlay(player2,player2Type));

bind("minus3", ()=> shiftBoth(-3));
bind("minus1", ()=> shiftBoth(-1));
bind("plus1", ()=> shiftBoth(1));
bind("plus3", ()=> shiftBoth(3));

bind("minus1_left", ()=> seek(player1,player1Type,getTime(player1,player1Type)-1));
bind("plus1_left", ()=> seek(player1,player1Type,getTime(player1,player1Type)+1));

bind("minus1_right", ()=> seek(player2,player2Type,getTime(player2,player2Type)-1));
bind("plus1_right", ()=> seek(player2,player2Type,getTime(player2,player2Type)+1));

bind("zoom1", ()=>{
  if(player1Type!=="html5") return;
  zoom1=!zoom1;
  player1.classList.toggle("zoomed",zoom1);
});

bind("zoom2", ()=>{
  if(player2Type!=="html5") return;
  zoom2=!zoom2;
  player2.classList.toggle("zoomed",zoom2);
});
