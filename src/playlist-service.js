var Playlist = Parse.Object.extend('Playlist'),
	PlaylistItem = Parse.Object.extend('PlaylistItem');

var PlaylistService = function () {};

/**
 * Takes a video object from the youtube API
 * sends it to the server to be saved and then
 * returns the server object.
 *
 * @param {Object} video Object mapped from youtube api
 * @return {Object} The Parse object
 */
PlaylistService.prototype.addVideo = function (video) {
	var playlistItem = new PlaylistItem();

	playlistItem.set('videoId', video.id);
	playlistItem.set('videoTitle', video.title);
	playlistItem.set('videoThumbnail', video.thumbnail);
	playlistItem.set('Playlist', this.currentPlaylist);
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

/**
 * Normalize video data returned from youtube api
 * into what we want to store on server
 *
 * @param {Object[]} videos
 * @return {Object[]}
 */
PlaylistService.prototype.normalizeVideos = function (videos) {
	return videos.map(function (video) {
		return {
			id: video.id.videoId,
			title: video.snippet.title,
			description: video.snippet.description,
			thumbnail: video.snippet.thumbnails.medium.url
		};
	});
};

/**
 * Fetch the playlist items for the given playlist
 *
 * @param {String} playlistId
 * @param {Function} callback Callback called on success that is invoked with playlistItems
 */
PlaylistService.prototype.fetchPlaylistItems = function (playlistId, callback) {
	console.log('fetch playlist');
	var playlistQuery = new Parse.Query(Playlist),
		service = this;
	playlistQuery.equalTo('code', playlistId);
	playlistQuery.find({
		success: function (playlists) {
			var playlist = playlists[0];
			// Store the current playlist for reference
			service.currentPlaylist = playlist;

			var query = new Parse.Query(PlaylistItem);
			query.equalTo('Playlist', playlist);
			query.ascending("createdAt");
			query.descending("likes");
			query.find({
				success: function (playlistItems) {
					console.log(playlistItems)
					callback(playlistItems);
				},
				error: function (object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					console.error('Error fetching playlist items.', error);
				}
			});
		},
		error: function (object, error) {
			console.error('Error fetching playlist object.', error);
		}
	});
};

window.playlistService = new PlaylistService();