var Playlist = Parse.Object.extend('Playlist')

var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		getInitialState: function() {
			return {
				init: false,
				playlistId: 'you should never be loading this',
				defaultUsername: '',
			};
		},
		componentDidMount: function() {
			// This function is called upon load, and currently only loads the
			// default party name from an external API.
			$.get('http://randomword.setgetgo.com/get.php', function(result) {
				this.setState({
					defaultUsername: result,
				});
			}.bind(this));
		},
		handleChange: function(event) {
			// You need this to update a text box, apparently.
			this.setState({
				defaultUsername: event.target.value,
			});
		},
		render: function () {
			if (this.state.init) {
				return (
					<window.SlideContainerComponent playlistId ={this.state.playlistId}/>
				);
			} else {
				var playlistName = "testing with spaces";
				return (
					<div>
					<h3> Create a new party with a playlist id, or join an existing
					one. </h3>
					<input type='text' name='playlist-id' id='playlist-id'
						value={this.state.defaultUsername}
						onChange={this.handleChange} />
					<button className='btn new-playlist-button' onClick={this.newPlaylist}>
						New
					</button>
					<button className='btn existing-playlist-button'
						onClick={this.existingPlaylist}> Join
					</button>
					</div>
				);
			}
		},
		newPlaylist: function() {
			var playlist = new Playlist();
			var playlistId = document.getElementById('playlist-id').value;
			playlist.set('code', playlistId);
			playlist.save(null, {
				success: function() {
					this.setState({
						init: true,
						playlistId: playlistId,
					});
				}.bind(this),
				failure: function(playlist, error) {
					console.error('Could not make playlist', error.message);
				},
			})

		},
		existingPlaylist: function() {
			var playlistId = document.getElementById('playlist-id').value;
			this.setState({
				init: true,
				playlistId: playlistId,
			});
		},
	}),
	MainComponentFactory = React.createFactory(MainComponent);

ReactDOM.render(
	new MainComponentFactory(),
  document.getElementById('main')
);