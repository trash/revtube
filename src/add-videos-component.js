var AddVideosComponent = React.createClass({
	getInitialState: function () {
		return {
			searchValue: '',
			disabled: !window.youtubeApiReady,
			searchResults: []
		};
	},
	onSearchChange: function (event) {
		var searchTerm = event.target.value;
		this.setState({
			searchValue: searchTerm
		});

		this.queryYoutube();
	},
	queryYoutube: _.debounce(function () {
		var request = gapi.client.youtube.search.list({
			q: this.state.searchValue,
			part: 'snippet',
			maxResults: 10
		});
		request.execute(function (response) {
			this.updateResults(response.items);
		}.bind(this));
	}, 250),
	updateResults: function (videos) {
		videos = videos.map(function (video) {
			return {
				id: video.id.videoId,
				title: video.snippet.title,
				description: video.snippet.description,
				thumbnail: video.snippet.thumbnails.default.url
			}
		});
		this.setState({
			searchResults: videos
		});
	},
	componentWillMount: function () {
		events.on('youtube-api-ready', function () {
			this.setState({
				disabled: false
			});
		}.bind(this));
	},
	render: function () {
		var searchResults = this.state.searchResults;
		return (
			<div className="add-videos-container">
				<input disabled={ this.state.disabled }
					value={ this.state.searchValue }
					onChange={ this.onSearchChange }
					className={ 'form-control ' + (this.state.disabled ? 'disabled' : '') }
					type="text"
					placeholder="Search for videos..."/>
				<ul>
					{ searchResults.map(function (video) {
						return <li key={ video.id }>{ video.title }</li>
					}) }
				</ul>
			</div>
		);
	}
});

window.AddVideosComponent = AddVideosComponent;