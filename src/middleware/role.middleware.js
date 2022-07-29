'use strict';

module.exports = (role) => {
  // 'update'

  return (req, res, next) => {
    try {
      // user can do action
      if (req.user.role.includes(role) || req.user.role == 'admin') {
        next();
      } else {
        next('Access Denied');
      }
    } catch (e) {
      next('invalid login');
    }
  };
};
