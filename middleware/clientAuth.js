const Account = require('../models/client');

const auth = async (req, res, next) => {
  try {
    const accessKey = req.headers['key'];
    const user = req.headers['client'];

    const account = await Account.findById(user);
    if (!account) {
      throw new Error('account not found');
    }
    if(account.accessKey != accessKey){
      throw new Error('access key is '+account.accessKey+' but got '+accessKey);
    }
    req.client = account;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = auth;