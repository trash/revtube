var Playlist = Parse.Object.extend('Playlist'),
	PlaylistItem = Parse.Object.extend('PlaylistItem');

var PlaylistItemComponent = React.createClass({
	propTypes: {
		playlistItem: React.PropTypes.object.isRequired,
		voteVideo: React.PropTypes.func
	},
	render: function () {
		var playlistItem = this.props.playlistItem;
		var videoPicStyle = {
		  backgroundImage: 'url("' + playlistItem.get('videoThumbnail') + '")'
		};

		return (
			<li>
				<div className="video-pic" style={videoPicStyle}>
					<div className="video-duration">{ playlistItem.get('videoDuration') }</div>
				</div>
				<div className="video-title">{ playlistItem.get('videoTitle') }</div>
				<span className="video-likes glyphicon glyphicon-thumbs-up"> { playlistItem.get('likes') }</span>
				{ this.props.noVoteButton ? false :
					<button className="vote-button" onClick={ this.props.voteVideo(playlistItem) }>
						<i className="glyphicon glyphicon-thumbs-up"/>
					</button>
				}
			</li>
		);
	}
});

var PlaylistComponent = React.createClass({
	propTypes: {
		playlistId: React.PropTypes.string.isRequired
	},
	getInitialState: function () {
		return {
			playlistItems: null
		};
	},
	fetchPlaylistItems: function (playNext) {
		console.log('fetch playlist');
		var playlistQuery = new Parse.Query(Playlist),
			component = this;
		playlistQuery.get(this.props.playlistId, {
			success: function (playlist) {
				// async callback, component might unmount which causes this to break
				if (!component.isMounted()) {
					return;
				}
				component.playlist = playlist;

				var query = new Parse.Query(PlaylistItem);
				query.equalTo('Playlist', playlist);
				query.find({
					success: function (playlistItems) {
						console.log(playlistItems)
						// The object was retrieved successfully.
						component.setState({
							playlistItems: playlistItems
						});
						if (playNext) {
							window.playNext();
						}
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
	},
	addVideo: function (video) {
		var playlistItem = new PlaylistItem();

		playlistItem.set('videoId', video.id);
		playlistItem.set('videoTitle', video.title);
		playlistItem.set('videoThumbnail', video.thumbnail);
		playlistItem.set('Playlist', this.playlist);

		playlistItem.save(null, {
			success: function () {
				events.emit('playlist-update');
				this.fetchPlaylistItems();
			}.bind(this),
			error: function (playlistItem, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and message.
				console.error('Failed to create new object, with error code: ' + error.message);
			}
		});
	},
	voteVideo: function (video) {
		return function () {
			var query = new Parse.Query(PlaylistItem);
			query.get(video.id, {
				success: function (playlistItem) {
					var currentLikes = playlistItem.get('likes');
					playlistItem.set('likes', currentLikes + 1);
					playlistItem.save();
				}
			});
		};
	},
	componentDidMount: function () {
		this.fetchPlaylistItems(true);
		window.playlist = this;
	},
	componentWillMount: function () {
		events.on('add-video', this.addVideo);
		setInterval(this.fetchPlaylistItems, 10000);
	},
	// playNext: function () {
	// 	var current = this.state.playlistItems.shift();
	// 	window.playNext(current.get('videoId'));
	// 	this.setState({
	// 		playlistItems: this.state.playlistItems
	// 	});
	// },
	render: function () {
		var playlistItems = this.state.playlistItems;
		if (!playlistItems) {
			return <h3>Fetching playlist...</h3>;
		}
		return (
			<div>
				<PlaylistItemComponent key={ playlistItems[0].id }
					noVoteButton={ true }
					playlistItem={ playlistItems[0] } />
				<h3>Up Next</h3>
				<ul className="list-unstyled playlist-container" id="queue-list">
					{ playlistItems.slice(1, playlistItems.length).map(function (playlistItem) {
						return <PlaylistItemComponent key={ playlistItem.id }
							voteVideo={ this.voteVideo }
							playlistItem={ playlistItem } />
					}.bind(this)) }
				</ul>
			</div>
		);
	}
});

window.PlaylistComponent = PlaylistComponent;