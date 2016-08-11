import test from 'ava';
import config from '../config';
import threeWords from '../modules/three';

test.cb('three', t => {
	threeWords(`${config.nick}: date`, t.end);
});
