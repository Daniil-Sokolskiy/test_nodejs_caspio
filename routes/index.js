import CaspioHelper from '../helpers/caspio';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Test index' });
});

/*router.get('/users', async function(req, res, next) {
  const token = await CaspioHelper.getAccessToken();
  const rows = await CaspioHelper.getAll('tables', 'Users_ES', '',token);
  res.status(200).send(JSON.stringify(rows));
});*/

module.exports = router;
