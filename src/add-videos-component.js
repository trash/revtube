var SearchVideoResult = React.createClass({
	propTypes: {
		video: React.PropTypes.object.isRequired
	},
	render: function () {
		var video = this.props.video;
		return (
			<li className="search-video-result" style={ { 'backgroundImage': 'url(' + video.thumbnail + ')' } } key={ video.id }>
				<span>{ video.title }</span>
				<button onClick={ this.props.addVideo(video) }>
					<i className="glyphicon glyphicon-plus"></i>
				</button>
			</li>
		);
	}
});

var AddVideosComponent = React.createClass({
	getInitialState: function () {
		return {
			searchValue: '',
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
		$.ajax({
			type: 'get',
			url: 'https://content.googleapis.com/youtube/v3/search',
			data: {
				part: 'snippet',
				q: this.state.searchValue,
				key: 'AIzaSyBqf7fU8HgDmRG752sxL1eoff5rSJVIEKk',
				maxResults: 10
			},
			success: function (response) {
				console.log(response);
				this.updateResults(response.items);
			}.bind(this)
		});
	}, 250),
	updateResults: function (videos) {
		videos = videos.map(function (video) {
			return {
				id: video.id.videoId,
				title: video.snippet.title,
				description: video.snippet.description,
				thumbnail: video.snippet.thumbnails.medium.url
			}
		});
		this.setState({
			searchResults: videos
		});
	},
	addVideo: function (video) {
		return function () {
			events.emit('add-video', video);
		};
	},
	componentDidMount: function () {
		this.queryYoutube();
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
						return <SearchVideoResult key={ video.id }
							addVideo={ this.addVideo }
							video={ video }/>
					}.bind(this)) }
				</ul>
			</div>
		);
	}
});

window.AddVideosComponent = AddVideosComponent;