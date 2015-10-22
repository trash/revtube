var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		render: function () {
			return (
				<window.SlideContainerComponent/>
			);
		}
	}),
	MainComponentFactory = React.createFactory(MainComponent);

ReactDOM.render(
	new MainComponentFactory(),
  document.getElementById('main')
);