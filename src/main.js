var Playlist = Parse.Object.extend('Playlist')

// Helper function for parsing url params, copied from stackoverflow
function GetQueryParams() {
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
		// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
			query_string[pair[0]] = arr;
		// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	} 
	return query_string;
}

var ParseTestComponent = window.ParseTestComponent,
	MainComponent = React.createClass({
		getInitialState: function() {
			var params = GetQueryParams();
			if (params['party_code'] === undefined) {
				return {
					init: false,
					playlistId: 'you should never be loading this',
					defaultUsername: '',
				};
			} else {
				console.log(params['party_code'])
				return {
					init: true,
					playlistId: params['party_code'],
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
					<window.SlideContainerComponent playlistId ={this.state.playlistId}/>
				);
			} else {
				var playlistName = "testing with spaces";
				return (
					<div id='init'>
					<h1 id='init-title'> Welcome to PartyTube </h1>
					<h3 id="init-new-party"> Create a new party </h3>
					<input type='text' name='new-playlist-id' id='new-playlist-id'
						value={this.state.defaultUsername}
						onChange={this.handleChange} />
					<button className='btn init-button' onClick={this.newPlaylist}>
						New
					</button>

					<h3 id="init-existing-party"> Join an existing party </h3>
					<input type='text' name='existing-playlist-id' id='existing-playlist-id' />
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
		},
	}),
	MainComponentFactory = React.createFactory(MainComponent);

ReactDOM.render(
	new MainComponentFactory(),
  document.getElementById('main')
);