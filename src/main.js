var Playlist = Parse.Object.extend('Playlist')

var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		getInitialState: function() {
			return {
				init: false,
				playlistId: 'you should never be loading this',
			};
		},
		render: function () {
			if (this.state.init) {
				return (
					<window.SlideContainerComponent playlistId ={this.state.playlistId}/>
				);
			} else {
				return (
					<div>
					<h3> Create a new party with a playlist id, or join an existing
					one. </h3>
					<input type='text' name='playlist-id' id='playlist-id'/>
					<button className='btn existing-playlist-button'
						onClick={this.existingPlaylist}> Join
					</button>
					<button className='btn new-playlist-button' onClick={this.newPlaylist}>
						New
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