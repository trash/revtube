var Playlist = Parse.Object.extend('Playlist'),
	PlaylistItem = Parse.Object.extend('PlaylistItem');

// Map to ghetto keep track of votes
var voted = {};

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
				<div className="video-pic" style={videoPicStyle}></div>
				<div className="video-title">{ playlistItem.get('videoTitle') }</div>
				<span className="video-likes glyphicon glyphicon-thumbs-up"> { playlistItem.get('likes') }</span>
				{ this.props.noVoteButton ? false :
					<button className={ 'vote-button ' + (playlistItem.id in voted ? 'active': '') } onClick={ this.props.voteVideo(playlistItem) }>
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
		var playlistItem = new PlaylistItem();

		playlistItem.set('videoId', video.id);
		playlistItem.set('videoTitle', video.title);
		playlistItem.set('videoThumbnail', video.thumbnail);
		playlistItem.set('Playlist', this.playlist);
		playlistItem.set('likes', 1);

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
				voted[playlistItem.id] = true;

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
			var query = new Parse.Query(PlaylistItem);
			query.get(video.id, {
				success: function (playlistItem) {
					voted[playlistItem.id] = true;

					var currentLikes = playlistItem.get('likes') || 0,
						newLikes = currentLikes + 1;
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
				<ul className="list-unstyled">
				<PlaylistItemComponent key={ playlistItems[0].id }
					noVoteButton={ true }
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