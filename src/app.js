Parse.initialize('EmxeEeMgQxwUeC42hDPXfHK0tnKoTcLSL5OeZsuy', 'p8cryLkuriL0mTlWCmiKMmy0zRbYeMhGJ5YQFG6k');

var qrcode = new QRCode("qrcode", {
    text: "http://localhost:9000/",
    width: 130,
    height: 130,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});

function showVideoInfo(){
    var title = window.player.B.videoData.title;
    var author = window.player.B.videoData.author;
    $("#title").text(title);
    $("#author").text(author);
}

window.initPlayer = function(videoId) {
    $('#video-container').tubular({
        videoId: videoId,
        mute: false,
        repeat: false
    });

    var oldOnPlayerReady = window.onPlayerReady;
    window.onPlayerReady = function(e) {
        oldOnPlayerReady(e);

        $(window).keypress(function(e) {
            if (e.keyCode === 0 || e.keyCode === 32) {
                // Dont pause if the user is typing text in an input
                if (e.target.nodeName === 'INPUT') {
                    return;
                }
                if (window.player.B.playerState == 1) // playing
                    window.player.pauseVideo();
                else if (window.player.B.playerState == 2) // paused
                    window.player.playVideo();
            }
        });
    }

    var oldOnPlayerStateChange = window.onPlayerStateChange;
    window.onPlayerStateChange = function (event) {
        oldOnPlayerStateChange(event);
        if (window.player.B.playerState == 0) { // stopped
            var topVideo = window.playlist.getTopVideo();
            window.playlist.removeVideo(topVideo.id);
        }
        else if (window.player.B.playerState == 1) // playing
            showVideoInfo();
    }
}

window.playNext = function() {
    console.log('play next ');

    var currentVideo = window.playlist.getTopVideo();
    if (!currentVideo) {
        return;
    }
    currentVideoId = currentVideo.get('videoId');
    window.playlist.markAsCurrent(currentVideo);

    if (window.player === undefined) {
        window.initPlayer(currentVideoId);
        window.onYouTubeIframeAPIReady();
    }
    else {
        window.player.loadVideoById(currentVideoId);
    }
}