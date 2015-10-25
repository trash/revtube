var votedVideos = playlistService.votedVideos;

var PlaylistItemComponent = React.createClass({
	propTypes: {
		playlistItem: React.PropTypes.object.isRequired,
		voteVideo: React.PropTypes.func,
		activeVideo: React.PropTypes.bool
	},
	render: function () {
		var playlistItem = this.props.playlistItem,
			videoPicStyle = {
				backgroundImage: 'url("' + playlistItem.get('videoThumbnail') + '")'
			};

		return (
			<li className={ (this.props.activeVideo ? 'active-video' : '') }>
				{ this.props.activeVideo ?
					<i className="active-video-icon glyphicon glyphicon-play"/>
				 : false }
				<div className="video-pic" style={ videoPicStyle }></div>
				<div className="video-title">{ playlistItem.get('videoTitle') }</div>
				<span className="video-likes glyphicon glyphicon-thumbs-up"> { playlistItem.get('likes') }</span>
				{ this.props.activeVideo ? false :
					<button className={ 'vote-button ' + (playlistItem.id in votedVideos ? 'active': '') } onClick={ this.props.voteVideo(playlistItem) }>
						<i className="glyphicon glyphicon-thumbs-up"/>
					</button>
				}
			</li>
		);
	}
});

window.PlaylistItemComponent = PlaylistItemComponent;