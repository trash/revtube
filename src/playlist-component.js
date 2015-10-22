var Playlist = Parse.Object.extend('Playlist'),
	PlaylistItem = Parse.Object.extend('PlaylistItem');

var PlaylistItemComponent = React.createClass({
	propTypes: {
		playlistItem: React.PropTypes.object.isRequired
	},
	render: function () {
		var playlistItem = this.props.playlistItem;
		var videoPicStyle = {
		  backgroundImage: 'url(' + playlistItem.get('videoThumbnail') + ')',
		  WebkitTransition: 'all', // note the capital 'W' here
		  msTransition: 'all' // 'ms' is the only lowercase vendor prefix
		};

		return (
			<li>
				<div className="video-pic" style={videoPicStyle}>
					<div className="video-duration">{ playlistItem.get('videoDuration') }</div>
				</div>
				<div className="video-title">{ playlistItem.get('videoTitle') }</div>
				<div className="video-likes">{ playlistItem.get('likes') }</div>
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
	fetchPlaylistItems: function () {
		var playlistQuery = new Parse.Query(Playlist),
			component = this;
		playlistQuery.get(this.props.playlistId, {
			success: function (playlist) {
				// async callback, component might unmount which causes this to break
				if (!component.isMounted()) {
					return;
				}
				var query = new Parse.Query(PlaylistItem);
				query.equalTo('Playlist', playlist);
				query.find({
					success: function (playlistItems) {
						console.log(playlistItems)
						// The object was retrieved successfully.
						component.setState({
							playlistItems: playlistItems
						});
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
	componentDidMount: function () {
		this.fetchPlaylistItems();
	},
	render: function () {
		var playlistItems = this.state.playlistItems;
		if (!playlistItems) {
			return <h3>Fetching playlist...</h3>;
		}
		return (
			<ul className="list-unstyled playlist-container" id="queue-list">
				{ playlistItems.map(function (playlistItem) {
					return <PlaylistItemComponent key={ playlistItem.id } playlistItem={ playlistItem } />
				}) }
			</ul>
		);
	}
});

window.PlaylistComponent = PlaylistComponent;