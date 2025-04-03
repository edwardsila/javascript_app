const Account = require('../models/account');

const auth = async (req, res, next) => {
  try {
    const accessKey = req.headers['key'];
    const user = req.headers['user'];

    const account = await Account.findById(user);
    if (!account) {
      throw new Error('account not found');
    }
    if(account.accessKey != accessKey){
      throw new Error('access key is '+account.accessKey+' but got '+accessKey);
    }
    req.user = account;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = auth;