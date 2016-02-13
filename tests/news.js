import test from 'ava';
import news from '../modules/news';
import config from '../config';

test.cb('news', t => {
	news(`${config.nick}: news`, t.end);
});
