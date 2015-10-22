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
					<window.PlaylistComponent playlistId={ 'vxLtIafOqa' }/>
					<button className="btn add-video-button" onClick={ this.slideLeft }>
						<i className="glyphicon glyphicon-plus"/>
					</button>
				</div>
				<div className="right">
					Search and add videos here
				</div>
			</div>
		);
	}
});

window.SlideContainerComponent = SlideContainerComponent;