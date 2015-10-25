Parse.initialize('EmxeEeMgQxwUeC42hDPXfHK0tnKoTcLSL5OeZsuy', 'p8cryLkuriL0mTlWCmiKMmy0zRbYeMhGJ5YQFG6k');

// Render the main react component on the dom
var MainComponentFactory = React.createFactory(MainComponent);

ReactDOM.render(
	new MainComponentFactory(),
  document.getElementById('main')
);

// Bootstrap the rest of the app
require('./bootstrap-app');