var Playlist = Parse.Object.extend('Playlist'),
	PlaylistItem = Parse.Object.extend('PlaylistItem');

var PlaylistService = function () {
	this.votedVideos = {};
	this.addedVideos = {};
};

/**
 * Takes a video object from the youtube API
 * sends it to the server to be saved and then
 * returns the server object.
 *
 * @param {Object} video Object mapped from youtube api
 * @return {Object} The Parse object
 */
PlaylistService.prototype.addVideo = function (video, callback) {
	var playlistItem = new PlaylistItem();
	callback = callback || function(){};

	playlistItem.set('videoId', video.id);
	playlistItem.set('videoTitle', video.title);
	playlistItem.set('videoThumbnail', video.thumbnail);
	playlistItem.set('Playlist', this.currentPlaylist);
	playlistItem.set('likes', 1);

	playlistItem.save(null, {
		success: function (playlistItem) {
			this.addedVideos[playlistItem.get('videoId')] = true;
			events.emit('playlist-update');
			callback();
		}.bind(this),
		error: function (playlistItem, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			console.error('Failed to create new object, with error code: ' + error.message);
		}
	});

	return playlistItem;
};

PlaylistService.prototype.markAsCurrent = function (video) {
	var query = new Parse.Query(PlaylistItem);
	query.get(video.id, {
		success: function (playlistItem) {
			// 1000 extra likes ensures we're keeping this item at the top of the list.
			// This is a hacky way instead of keeping a pointer to current.
			var currentLikes = playlistItem.get('likes') || 0,
				extraLikesForCurrent = 1000,
				newLikes = currentLikes < extraLikesForCurrent
					? currentLikes + extraLikesForCurrent
					: currentLikes;
			playlistItem.set('likes', newLikes);
			playlistItem.save();
		}.bind(this)
	});
};

/**
 * Remove the video with given id from Parse
 * Invokes the callback on success
 *
 * @param {String} id
 * @param {Function} callback
 */
PlaylistService.prototype.removeVideo = function (id, callback) {
	callback = callback || function(){};

	// Get the video then destroy it on db
	var query = new Parse.Query(PlaylistItem);
	query.get(id, {
		success: function (video) {
			console.log('destroy dat ish');
			video.destroy({
				success: function () {
					callback();
				}
			});
		}
	});
};

PlaylistService.prototype.voteVideo = function (video, callback) {
	// Add vote if it's not already been voted on
	var positiveVote = !(video.id in this.votedVideos),
		query = new Parse.Query(PlaylistItem);
	query.get(video.id, {
		success: function (playlistItem) {
			if (positiveVote) {
				this.votedVideos[playlistItem.id] = true;
			} else {
				delete this.votedVideos[playlistItem.id];
			}

			var currentLikes = playlistItem.get('likes') || 0,
				newLikes = currentLikes + (positiveVote ? 1 : -1);
			playlistItem.set('likes', newLikes);
			playlistItem.save();

			callback(playlistItem.id, newLikes);
		}.bind(this)
	});
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
	callback = callback || function(){};

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