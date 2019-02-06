import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import VideoPlayer from 'react-video-js-player';

class VideoApp extends Component {
    constructor(props) {
      super(props);
      this.player = {}
      this.state = {
          video: {
              src: this.props.mp4file,
              poster: "https://peertube.cpy.re/static/thumbnails/e2651856-4809-408a-99d4-b85b01fefb09.jpg"
          }
      }
    }

    onPlayerReady(player){
        // console.log("Player is ready: ", player);
        // this.player = player;
    }

    onVideoPlay(duration){
        // console.log("Video played at: ", duration);
    }

    onVideoPause(duration){
        // console.log("Video paused at: ", duration);
    }

    onVideoTimeUpdate(duration){
        // console.log("Time updated: ", duration);
    }

    onVideoSeeking(duration){
        // console.log("Video seeking: ", duration);
    }

    onVideoSeeked(from, to){
        // console.log(`Video seeked from ${from} to ${to}`);
    }

    onVideoEnd(){
        // console.log("Video ended");
    }

    render() {
        return (
            <div>
                <VideoPlayer
                    controls={true}
                    src={this.state.video.src}
                    poster={this.state.video.poster}
                    width="720"
                    height="420"
                    onReady={this.onPlayerReady.bind(this)}
                    onPlay={this.onVideoPlay.bind(this)}
                    onPause={this.onVideoPause.bind(this)}
                    onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
                    onSeeking={this.onVideoSeeking.bind(this)}
                    onSeeked={this.onVideoSeeked.bind(this)}
                    onEnd={this.onVideoEnd.bind(this)}
                />
            </div>
        );
    }
}



class App extends Component {
  state = {
    torrentInfoHash: "",
    torrentMagnetURI: "",
    torrentName: "",
    torrentProgress: "",
    torrentFiles: [],
    mp4file:{}
  }

  componentDidMount() {
    // Sintel, a free, Creative Commons movie
    var torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

    var WebTorrent = require('webtorrent');
    var client = new WebTorrent();

    client.on('error', err => {
      console.log('[+] Webtorrent error: ' + err.message);
    });

    client.add(torrentId, (torrent) => {
      const interval = setInterval(() => {
        // console.log('[+] Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
        this.setState({torrentProgress: (torrent.progress * 100).toFixed(1) + '%'});
      }, 5000);
      torrent.on('done', () => {
        console.log('Progress: 100%');
        clearInterval(interval);
      })

      this.setState({
        torrentInfoHash: torrent.infoHash,
        torrentMagnetURI: torrent.magnetURI,
        torrentName: torrent.name,
        torrentFiles: torrent.files
      });

      var mp4File = this.state.torrentFiles.find(function (file) {
        return file.name.endsWith('.mp4');
        
      });

      this.setState({mp4file:mp4File.path});

      console.log(mp4File.path);

      // TODO Figure out a better way to render these files 
      this.state.torrentFiles.map((file, i) => {
        file.appendTo('body');
        // console.log(file);
      })

    });
  }

  render() {
    const mp4file = this.state.mp4file;
    return (
      <div>
        <VideoApp mp4file={mp4file} />
        <h1>{this.state.torrentName}</h1>
        <p><b>Torrent Info Hash: </b>{this.state.torrentInfoHash}</p>
        <p><b>Torrent Progress: </b>{this.state.torrentProgress}</p>
      </div>
    );
  }
}

export default App;
