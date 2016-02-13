import test from 'ava';
import date from '../modules/date';
import config from '../config';

test.cb('date', t => {
	date(`${config.nick}: date`, t.end);
});
