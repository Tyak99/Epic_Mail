import db from '../database/index';

exports.postGroup = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      status: 'Failed',
      error: 'Provide the neccessary details',
    });
  }
  db.query('SELECT * FROM groups WHERE name = $1', [name], (err, data) => {
    if (data.rows[0]) {
      return res.status(409).json({
        status: 'Failed',
        error: 'Team name already exist',
      });
    }
    db.query(
      'INSERT INTO groups (name, adminid) VALUES ($1, $2) RETURNING *',
      [name, req.decoded.sub],
      (err, group) => {
        const { id } = group.rows[0]
        db.query('INSERT INTO groupmembers (groupid, memberid, userrole) VALUES ($1, $2, $3) RETURNING *', [id, req.decoded.sub, 'admin'], (err, groupmember) => {
          return res.status(201).json({
            status: 'success',
            data: {
              id: group.rows[0].id,
              name: group.rows[0].name,
              role: groupmember.rows[0].userrole,
            }
          });
        })
      }
    );
  });
};
