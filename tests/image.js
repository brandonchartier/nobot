import test from 'ava';
import image from '../modules/image';
import config from '../config';

test.cb('image', t => {
	image(`${config.nick}: image stuff`, t.end);
});
