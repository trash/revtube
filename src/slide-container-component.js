var root_url = 'http://localhost:8000';

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
		// Also update the qr code when this is rendered.
		var party_url = root_url + "?party_code=" + this.props.playlistId + "&/";
		$('#join-link').html(party_url);
		var qrcode = new QRCode("qrcode", {
			text: party_url,
			width: 130,
			height: 130,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
		$('#join-container').css('visibility', 'visible');

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
	}
});

window.SlideContainerComponent = SlideContainerComponent;