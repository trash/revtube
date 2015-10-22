var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		render: function () {
			return (
				<div className="main">
					<h1>RevTube</h1>
					<ParseTestComponent/>
				</div>
			);
		}
	}),
	MainComponentFactory = React.createFactory(MainComponent);

ReactDOM.render(
  new MainComponentFactory(),
  document.getElementById('main')
);