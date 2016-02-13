import test from 'ava';
import rap from '../modules/rap';
import config from '../config';

test.cb('rap', t => {
	rap(`${config.nick}: rap stuff`, t.end);
});
