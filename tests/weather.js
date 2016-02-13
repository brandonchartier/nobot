import test from 'ava';
import weather from '../modules/weather';
import config from '../config';

test.cb('weather', t => {
	weather(`${config.nick}: weather`, t.end);
});
