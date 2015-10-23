var SlideContainerComponent = React.createClass({
	propTypes: {
		playlistId: React.PropTypes.string,
	},
	getInitialState: function () {
		return {
			slideLeft: false
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
	render: function () {
		this.renderQrCode();

		return (
			<div className={ 'slide-container ' + (this.state.slideLeft ? 'slide-left' : '') }>
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
	},
	renderQrCode: function() {
		// Also update the qr code when this is rendered.
		var party_url = window.location;
		$('#join-link').text(party_url);
		$('#qrcode').html(''); // clean up the previous one

		// var qrcode = new QRCode("qrcode", {
		// 	text: party_url,
		// 	width: 130,
		// 	height: 130,
		// 	colorDark : "#000000",
		// 	colorLight : "#ffffff",
		// 	correctLevel : QRCode.CorrectLevel.H
		// });

		$('#qrcode').qrcode({
			render: 'canvas',
			size: 130,
			text: party_url
		});

		$('#join-container').css('visibility', 'visible');
	}
});

window.SlideContainerComponent = SlideContainerComponent;