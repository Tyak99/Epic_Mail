import { validationResult } from 'express-validator/check';
import db from '../db/index';

exports.postGroup = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.send({
      status: 400,
      error: 'Please input group name',
    });
  }
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.send({
      status: 400,
      error: error.array()[0].msg,
    });
  }
  db.query('SELECT * FROM groups WHERE name = $1', [name], (err, group) => {
    if (err) {
      return res.send({
        status: 500,
        error: 'Internal server error',
      });
    }
    if (group.rows[0]) {
      return res.send({
        status: 400,
        error: 'Group name already taken, try another',
      });
    }
    db.query(
      'INSERT INTO groups (name) VALUES ($1) RETURNING *',
      [name],
      (err, response) => {
        if (err) {
          return res.send({
            status: 500,
            error: 'Internal server error',
          });
        }
        const { id, name } = response.rows[0];
        db.query(
          'INSERT INTO groupmembers (groupid, memberid, userrole) VALUES ($1, $2, $3) RETURNING *',
          [id, 2, 'admin'],
          (err, data) => {
            if (err) {
              return res.send({
                status: 500,
                error: 'Internal server error',
              });
            }
            return res.send({
              status: 201,
              data: {
                id,
                name,
                role: data.rows[0].userrole,
              },
            });
          });
      });
  });
};
