var YoutubeService = function () {};

YoutubeService.prototype.searchForVideos = function (query, callback) {
	$.ajax({
		type: 'get',
		url: 'https://content.googleapis.com/youtube/v3/search',
		data: {
			part: 'snippet',
			type: 'video',
			q: query,
			key: 'AIzaSyBqf7fU8HgDmRG752sxL1eoff5rSJVIEKk',
			maxResults: 10
		},
		success: function (response) {
			console.log(response);
			callback(this.normalizeVideos(response.items));
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
YoutubeService.prototype.normalizeVideos = function (videos) {
	return videos.map(function (video) {
		return {
			id: video.id.videoId,
			title: video.snippet.title,
			description: video.snippet.description,
			thumbnail: video.snippet.thumbnails.medium.url
		};
	});
};

window.youtubeService = new YoutubeService();