import test from 'ava';
import clever from '../modules/clever';
import config from '../config';

test.cb('cleverbot', t => {
	clever(`${config.nick}: test`, t.end);
});
