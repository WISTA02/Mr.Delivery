'use strict';

module.exports = (role) => {
  // 'update'

  return (req, res, next) => {
    try {
      // user can do action
      if (role.includes(req.user.role) || req.user.role == 'admin') {
        next();
      } else {
        next('Access Denied');
      }
    } catch {
      next('invalid login');
    }
  };
};
