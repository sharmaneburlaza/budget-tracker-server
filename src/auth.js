// used for authentication and authorization purposes
// JWTs are self-contained tokens that contain information about the user or client in the form of JSON objects
const jwt = require('jsonwebtoken');

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email
    }
    return jwt.sign(data, process.env.SECRET, {})
}

module.exports.verify = (req, res, next) => {
    let token = req.headers.authorization;

    if (typeof token !== 'undefined') {
        token = token.slice(7, token.length);

        return jwt.verify(token, process.env.SECRET, (err, data) => {
            return err ? res.send({ auth: 'token verification failed'}) : next();
        })
    } else {
        return res.send({ auth: 'token is undefined' });
    }
}

module.exports.decode = (token) => {
    if (typeof token !== 'undefined') {
        token = token.slice(7, token.length);

        return jwt.verify(token, process.env.SECRET, (err, data) => {
            return err ? null : jwt.decode(token, { complete: true }).payload;
        })
    } else {
        return null;
    }
}