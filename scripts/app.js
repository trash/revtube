      Parse.initialize('EmxeEeMgQxwUeC42hDPXfHK0tnKoTcLSL5OeZsuy', 'p8cryLkuriL0mTlWCmiKMmy0zRbYeMhGJ5YQFG6k');

      var qrcode = new QRCode("qrcode", {
          text: "http://localhost:9000/",
          width: 130,
          height: 130,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
      });

      var bootstrapPlayer = function() {
          window.initPlayer = function(videoId) {
              $('#video-container').tubular({
                  videoId: videoId,
                  mute: false,
                  repeat: false
              });

              var oldOnPlayerStateChange = window.onPlayerStateChange;
              window.onPlayerStateChange = function(event) {
                  oldOnPlayerStateChange(event);
                  if (window.player.B.playerState == 0) { // stopped
                      var topVideo = window.playlist.getTopVideo();
                      window.playlist.removeVideo(topVideo.id);
                  }

                  var oldOnPlayerStateChange = window.onPlayerStateChange;
                  window.onPlayerStateChange = function(event) {
                      oldOnPlayerStateChange(event);
                      if (window.player.B.playerState == 0) { // stopped
                          var topVideo = window.playlist.getTopVideo();
                          window.playlist.removeVideo(topVideo.id, function() {
                              window.playNext();
                          });
                      }
                  }
              }
          }

              window.playNext = function() {
                  console.log('play next ');

                  var currentVideo = window.playlist.getTopVideo();
                  if (!currentVideo) {
                      return;
                  }
                  var currentVideoId = currentVideo.get('videoId');
                  window.playlist.markAsCurrent(currentVideo);

                  if (window.player === undefined) {
                      window.initPlayer(currentVideoId);
                      window.onYouTubeIframeAPIReady();
                  } else {
                      window.player.loadVideoById(currentVideoId);
                  }
              };
      }

              // Don't need a video if its mobile
              if (window.isMobile) {
                  window.playNext = function() {};
              } else {
                  bootstrapPlayer();
              }