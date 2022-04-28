import AudioPlayer from './audio-player';

const PlayerTime = class PlayerTime {
  constructor(data) {
    this.elPlayer = document.querySelector('.audio-player');
    this.elBg = document.querySelector('.background');
    this.data = data;
    this.currentStatus = this.getCurrentStatus();
  }

  randomize(sourceArray) {
    let list = sourceArray.map((value, index) => index);

    list = list.sort(() => Math.random() - 0.5);

    const results = list.map((number) => sourceArray[number]);

    return results;
  }

  video(day) {
    const video = document.querySelector('video');
    const source = document.querySelector('video source');

    if (source) {
      video.pause();
      source.setAttribute('src', this.data[day].video);

      video.load();
      video.play();

      return;
    }

    video.innerHTML = `<source src="${this.data[day].video}" type="video/mp4">`;

    video.addEventListener('canplay', () => {
      console.log('ready');
    });
  }

  generateButtons() {
    const elButtons = document.querySelector('.buttons');
    const buttons = ['on-air', 'morning', 'afternoon', 'night'];

    buttons.forEach((button) => {
      const btnEl = document.createElement('button');

      btnEl.textContent = button;
      btnEl.type = 'button';
      btnEl.classList.add('btn-dark');
      btnEl.classList.add('btn');
      btnEl.classList.add('ms-2');
      btnEl.classList.add('me-2');

      btnEl.addEventListener('click', () => {
        if (button === 'on-air') {
          this.startPlayerByHours();

          return;
        }

        this.showTrackControls();
        this.loadPlayListPlayer(button);
      });

      elButtons.appendChild(btnEl);
    });
  }

  background(day) {
    this.elBg.style.background = `url("${this.data[day].background}") no-repeat`;
    this.elBg.style.backgroundSize = 'cover';
  }

  startPlayer(status) {
    const { [status]: { playlist } } = this.data;

    this.video(status);
    this.elPlayer.innerHTML = '';
    this.a = new AudioPlayer('.audio-player', this.randomize(playlist), { autoplay: true });
  }

  loadPlayListPlayer(status) {
    if (this.a) {
      this.a.audio.pause();
      this.a.destroy();
    }

    this.startPlayer(status);
  }

  getCurrentStatus() {
    const hour = new Date().getHours();

    if (hour >= 8 && hour < 12) {
      return 'morning';
    }

    if (hour >= 12 && hour < 18) {
      return 'afternoon';
    }

    return 'night';
  }

  hideTrackControls() {
    const trackControls = document.querySelector('.track-controls');

    trackControls.style.display = 'none';
  }

  showTrackControls() {
    const trackControls = document.querySelector('.track-controls');

    trackControls.style.display = 'block';
  }

  startPlayerByHours() {
    let currentStatus = null;

    this.startPlayerInterval = setInterval(() => {
      const hour = new Date().getHours();
      this.currentStatus = this.getCurrentStatus();

      if (!this.audio) {
        if ((hour >= 8 && hour < 12) && this.currentStatus !== currentStatus) {
          currentStatus = 'morning';
          this.loadPlayListPlayer('morning');

          return;
        }

        if ((hour >= 12 && hour < 18) && this.currentStatus !== currentStatus) {
          currentStatus = 'afternoon';
          this.loadPlayListPlayer('afternoon');

          return;
        }

        if (
          ((hour >= 18 && hour < 23) || (hour >= 0 && hour < 8))
          && this.currentStatus !== currentStatus
        ) {
          currentStatus = 'night';
          this.loadPlayListPlayer('night');
        }

        return;
      }

      this.audio.destroy();
    }, 5000);

    setTimeout(() => {
      this.hideTrackControls();
    }, 5000);
  }

  run() {
    this.generateButtons();
    this.startPlayerByHours();
  }
};

export default PlayerTime;
