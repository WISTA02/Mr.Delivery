'use strict';

module.exports = (role) => {
  // 'update'

  return (req, res, next) => {
    try {
      // user can do action
      if (role.includes(req.user.role) || req.user.role == 'admin') {
        next();
      } else {
        res.status(403).send('Access Denied').end();
      }
    } catch (e) {
      res.status(403).send('Check middleware');
    }
  };
};
