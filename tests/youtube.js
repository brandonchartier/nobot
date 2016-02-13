import test from 'ava';
import youtube from '../modules/youtube';
import config from '../config';

test.cb('youtube', t => {
	youtube(`${config.nick}: youtube stuff`, t.end);
});
