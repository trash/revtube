'use strict';
var playlistService = require('./playlist-service'),
	youtubeService = require('./youtube-service'),
	events = require('./events');

var SearchVideoResult = React.createClass({
	propTypes: {
		video: React.PropTypes.object.isRequired
	},
	componentWillMount: function () {
		events.on('playlist-update', this.forceUpdate.bind(this));
	},
	render: function () {
		var video = this.props.video,
			videoIsAdded = video.id in playlistService.addedVideos;
		return (
			<li className="search-video-result" style={ { 'backgroundImage': 'url(' + video.thumbnail + ')' } } key={ video.id }>
				<span>{ video.title }</span>
				<button className={ videoIsAdded ? 'added' : '' } onClick={ this.props.addVideo(video) }>
					{ videoIsAdded ? <i className="glyphicon glyphicon-ok"></i>
					: <i className="glyphicon glyphicon-plus"></i>
					}
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
	queryYoutube: function () {
		youtubeService.searchForVideos(this.state.searchValue, function (videos) {
			this.setState({
				searchResults: videos
			});
		}.bind(this));
	},
	addVideo: function (video) {
		return function () {
			events.emit('add-video', video);
		};
	},
	goBack: function () {
		events.emit('slide-left');
	},
	componentDidMount: function () {
		this.queryYoutube();
	},
	componentWillMount: function () {
		// Instantiate reference to debounced query youtube function
		this.debouncedQueryYoutube = _.debounce(this.queryYoutube, 250);

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
				<button onClick={ this.goBack } className="add-videos-go-back">
					<i className="glyphicon glyphicon-chevron-left"/>
				</button>
			</div>
		);
	}
});

module.exports = AddVideosComponent;