var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		render: function () {
			return (
				<div className="main">
				    <h3 className="masthead-brand">PartyTube</h3>
                    <nav></nav>
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