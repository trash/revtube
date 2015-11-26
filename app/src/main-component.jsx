var Playlist = Parse.Object.extend('Playlist'),
	SlideContainerComponent = require('./slide-container-component.jsx');

var MainComponent = React.createClass({
	getInitialState: function() {
		var partyCode = window.location.hash.substr(1);
		if (partyCode === "") {
			return {
				init: false,
				playlistId: 'you should never be loading this',
				defaultUsername: '',
			};
		} else {
			console.log(partyCode)
			return {
				init: true,
				playlistId: partyCode,
				defaultUsername: '',
			}
		}
	},
	componentDidMount: function() {
		// This function is called upon load, and currently only loads the
		// default party name from an external API.
		$.get('http://randomword.setgetgo.com/get.php?len=7', function(result) {
			this.setState({
				defaultUsername: result.toLowerCase(),
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
				<SlideContainerComponent playlistId ={this.state.playlistId}/>
			);
		} else {
			var playlistName = "testing with spaces";
			return (
				<div id='init' className='form-inline'>
				<h1 id='init-title'> Welcome to PartyTube </h1>
				<h3 id="init-new-party"> Create a new party </h3>
				<input type='text' name='new-playlist-id' id='new-playlist-id'
					className='form-control'
					value={this.state.defaultUsername}
					onChange={this.handleChange} />
				<button className='btn init-button' onClick={this.newPlaylist}>
					New
				</button>

				<h3 id="init-existing-party"> Join an existing party </h3>
				<input type='text' name='existing-playlist-id' id='existing-playlist-id'
					className='form-control' />
				<button className='btn init-button'
					onClick={this.existingPlaylist}> Join
				</button>
				</div>
			);
		}
	},
	newPlaylist: function() {
		var playlist = new Playlist();
		var playlistId = document.getElementById('new-playlist-id').value;
		playlist.set('code', playlistId);
		playlist.save(null, {
			success: function() {
				this.setState({
					init: true,
					playlistId: playlistId,
				});
				window.location.hash = playlistId;
			}.bind(this),
			failure: function(playlist, error) {
				console.error('Could not make playlist', error.message);
			},
		})

	},
	existingPlaylist: function() {
		var playlistId = document.getElementById('existing-playlist-id').value;
		this.setState({
			init: true,
			playlistId: playlistId,
		});
		window.location.hash = playlistId;
	},
});

module.exports = MainComponent;