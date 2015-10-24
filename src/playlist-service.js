var PlaylistItem = Parse.Object.extend('PlaylistItem');

var PlaylistService = function () {};

PlaylistService.prototype.addVideo = function (video) {
	var playlistItem = new PlaylistItem();

	playlistItem.set('videoId', video.id);
	playlistItem.set('videoTitle', video.title);
	playlistItem.set('videoThumbnail', video.thumbnail);
	playlistItem.set('Playlist', this.playlist);
	playlistItem.set('likes', 1);

	playlistItem.save(null, {
		success: function (playlistItem) {
			addedVideos[playlistItem.get('videoId')] = true;
			events.emit('playlist-update');
			this.fetchPlaylistItems();
		}.bind(this),
		error: function (playlistItem, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			console.error('Failed to create new object, with error code: ' + error.message);
		}
	});

	return playlistItem;
};

window.playlistService = new PlaylistService();