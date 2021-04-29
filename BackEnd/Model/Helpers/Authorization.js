require('dotenv').config()
const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const authorize = (request, response, nxt) => {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return response.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return response.sendStatus(403);
        request.user = user
        nxt()
    })
}

module.exports = {
    authorize
}