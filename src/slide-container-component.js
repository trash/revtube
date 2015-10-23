var playlistId = 'vxLtIafOqa';

var SlideContainerComponent = React.createClass({
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
	render: function () {
		return (
			<div className={ 'slide-container ' + (this.state.slideLeft ? 'slide-left' : '') }>
				<div className="left">
	      			<h3>Up Next</h3>
					<window.PlaylistComponent playlistId={ playlistId }/>
					<button className="btn add-video-button" onClick={ this.slideLeft }>
						<i className={ 'glyphicon ' + (this.state.slideLeft ? 'glyphicon-chevron-right' : 'glyphicon-plus') }/>
					</button>
				</div>
				<div className="right">
					<window.AddVideosComponent playlistId={ playlistId }/>
				</div>
			</div>
		);
	}
});

window.SlideContainerComponent = SlideContainerComponent;