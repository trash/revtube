var Playlist = Parse.Object.extend('Playlist'),
	PlaylistItem = Parse.Object.extend('PlaylistItem'),
	PlaylistItemComponent = window.PlaylistItemComponent,
	playlistService = window.playlistService,
	addedVideos = window.tube.addedVideos,
	votedVideos = window.tube.votedVideos;

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
		playlistQuery.equalTo('code', this.props.playlistId);
		playlistQuery.find({
			success: function (playlists) {
				// async callback, component might unmount which causes this to break
				if (!component.isMounted()) {
					return;
				}
				var playlist = playlists[0];
				component.playlist = playlist;

				var query = new Parse.Query(PlaylistItem);
				query.equalTo('Playlist', playlist);
				query.ascending("createdAt");
				query.descending("likes");
				query.find({
					success: function (playlistItems) {
						console.log(playlistItems)
						// The object was retrieved successfully.
						component.setState({
							playlistItems: playlistItems
						});
						if (playNext === true) {
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
		// Update server
		var playlistItem = playlistService.addVideo(video);

		// Update the ui list of videos
		var oldPlaylistItems = this.state.playlistItems;
		oldPlaylistItems.push(playlistItem);
		this.setState({
			playlistItems: oldPlaylistItems
		});

		// They added their first video. start playing it
		if (this.state.playlistItems.length === 1) {
			window.playNext();
		}
	},
	markAsCurrent: function (video) {
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
	},
	updatePlaylistItemLikes: function (id, likes) {
		// this is inefficient but eh im tired and lazy
		var playlistItems = this.state.playlistItems,
			index = playlistItems.map(function (item) {
				return item.id;
			}).indexOf(id);
		playlistItems[index].set('likes', likes);
		this.setState({
			playlistItems: playlistItems
		});
	},
	voteVideo: function (video) {
		return function () {
			// Add vote if it's not already been voted on
			var positiveVote = !(video.id in votedVideos),
				query = new Parse.Query(PlaylistItem);
			query.get(video.id, {
				success: function (playlistItem) {
					if (positiveVote) {
						votedVideos[playlistItem.id] = true;
					} else {
						delete votedVideos[playlistItem.id];
					}

					var currentLikes = playlistItem.get('likes') || 0,
						newLikes = currentLikes + (positiveVote ? 1 : -1);
					playlistItem.set('likes', newLikes);
					playlistItem.save();

					this.updatePlaylistItemLikes(playlistItem.id, newLikes);
				}.bind(this)
			});
		}.bind(this);
	},
	removeVideo: function (id) {
		// Get the video then destroy it on db
		var self = this;
		var query = new Parse.Query(PlaylistItem);
		query.get(id, {
			success: function (video) {
				console.log('destroy dat ish');
				video.destroy({
					success: function(){
						self.fetchPlaylistItems(true);
					}
				});
			}
		});

	},
	getTopVideo: function () {
		if (!this.state.playlistItems.length) {
			return false;
		}
		return this.state.playlistItems[0];
	},
	componentDidMount: function () {
		this.fetchPlaylistItems(true);
		window.playlist = this;
	},
	componentWillMount: function () {
		events.on('add-video', this.addVideo);
		// events.on('video-ended', this.);
		setInterval(this.fetchPlaylistItems, 5000);
	},
	render: function () {
		var playlistItems = this.state.playlistItems;
		if (!playlistItems) {
			return <h3>Fetching playlist...</h3>;
		} else if (!playlistItems.length) {
			return <h3>Empty playlist. Add some videos.</h3>;
		}
		return (
			<div>
				<ul className="list-unstyled" id="current-list">
				<PlaylistItemComponent key={ playlistItems[0].id }
					activeVideo={ true }
					playlistItem={ playlistItems[0] } />
				</ul>
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