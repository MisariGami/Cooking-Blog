function admin(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/login');
}

module.exports = admin;
// && req.user.role === 'admin'