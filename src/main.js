var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		render: function () {
			return (
				<div className="main">
					<PlaylistComponent playlistId={ 'vxLtIafOqa' }/>
				</div>
			);
		}
	}),
	MainComponentFactory = React.createFactory(MainComponent);

ReactDOM.render(
    new MainComponentFactory(),
  document.getElementById('main')
);