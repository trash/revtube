'use strict';
var PlaylistComponent = require('./playlist-component'),
	AddVideosComponent = require('./add-videos-component'),
	events = require('./events');

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
		this.renderQrCode();

		return (
			<div className={ 'slide-container ' + (this.state.slideLeft ? 'slide-left' : '') +
				(this.state.hide ? ' slide-hidden' : '' ) }
				onMouseOver={ this.unhide }
				onMouseOut={ this.hide }>
				<div className="left">
					<PlaylistComponent playlistId={ this.props.playlistId }/>
					<button className="btn add-video-button" onClick={ this.slideLeft }>
						<i className={ 'glyphicon ' + (this.state.slideLeft ? 'glyphicon-chevron-right' : 'glyphicon-plus') }/>
					</button>
				</div>
				<div className="right">
					<AddVideosComponent playlistId={ this.props.playlistId }/>
				</div>
			</div>
		);
	},
	renderQrCode: function() {
		// Also update the qr code when this is rendered.
		var party_url = window.location.href;
		$('#join-link').text(this.props.playlistId);
		$('#qrcode').html(''); // clean up the previous one

		$('#qrcode').qrcode({
			render: 'canvas',
			width: 150,
			height: 150,
			text: '"' + party_url + '"'
		});

		$('#join-container').css('visibility', 'visible');
	}
});

module.exports = SlideContainerComponent;