var playlistId = 'vxLtIafOqa';

var SlideContainerComponent = React.createClass({
	propTypes: {
		playlistId: React.PropTypes.string,
	},
	getInitialState: function () {
		return {
			slideLeft: false,
			hide: true,	// slideLeft and hide shouldn't both be true.
		};
	},
	slideLeft: function () {
		this.setState({
			slideLeft: !this.state.slideLeft
		});
	},
	componentWillMount: function () {
		events.on('slide-left', this.slideLeft);
	},
	hide: function () {
		this.setState({
			hide: true,
		});
	},
	unhide: function () {
		this.setState({
			hide: false,
		});
	},
	render: function () {
		return (
			<div className={ 'slide-container ' + (this.state.slideLeft ? 'slide-left' : '') +
				(this.state.hide ? ' slide-hidden' : '' ) }
				onMouseOver={ this.unhide }
				onMouseOut={ this.hide }>
				<div className="left">
					<window.PlaylistComponent playlistId={ this.props.playlistId }/>
					<button className="btn add-video-button" onClick={ this.slideLeft }>
						<i className={ 'glyphicon ' + (this.state.slideLeft ? 'glyphicon-chevron-right' : 'glyphicon-plus') }/>
					</button>
				</div>
				<div className="right">
					<window.AddVideosComponent playlistId={ this.props.playlistId }/>
				</div>
			</div>
		);
	}
});

window.SlideContainerComponent = SlideContainerComponent;