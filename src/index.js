import PlayerTime from './app/player-time';
import playlist from './app/data/playlist';

import './index.scss';

const playerTime = new PlayerTime(playlist);

playerTime.run();
