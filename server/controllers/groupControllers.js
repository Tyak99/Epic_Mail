import db from '../database/index';

const postGroup = (req, res) => {
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
        const { id } = group.rows[0];
        db.query(
          'INSERT INTO groupmembers (groupid, memberid, userrole) VALUES ($1, $2, $3) RETURNING *',
          [id, req.decoded.sub, 'admin'],
          (err, groupmember) => {
            return res.status(201).json({
              status: 'success',
              data: {
                id: group.rows[0].id,
                name: group.rows[0].name,
                role: groupmember.rows[0].userrole,
              },
            });
          }
        );
      }
    );
  });
};

const addUserToGroup = (req, res) => {
  const { groupid } = req.params;
  const userId = req.decoded.sub;
  // search the group table if such group exists
  db.query('SELECT * FROM groups WHERE id = $1', [groupid], (err, group) => {
    if (!group) {
      return res.status(404).json({
        status: 'Failed',
        error: 'Group does not exist',
      });
    }
    // if it exists, check if the user sending the request is an admin
    if (group.rows[0].adminid !== userId) {
      return res.status(401).json({
        status: 'Failed',
        error: 'Sorry, only group admin can modify group',
      });
    }
    // if the user has admin priviledge, search the user table if the user that should
    // be added to the group exists
    db.query(
      'SELECT * FROM users WHERE email = $1',
      [req.body.email],
      (err, user) => {
        if (!user.rows[0]) {
          return res.status(404).json({
            status: 'Failed',
            error: 'Sorry no user with that email found',
          });
        }
        const memberid = user.rows[0].id;
        const values = [groupid, memberid, 'member'];
        db.query(
          'INSERT INTO groupmembers (groupid, memberid, userrole) VALUES ($1, $2, $3) RETURNING *',
          values,
          (err, groupmember) => {
            if (groupmember.rows[0]) {
              return res.status(201).json({
                status: 'success',
                data: {
                  id: groupmember.rows[0].groupid,
                  userId: memberid,
                  userRole: groupmember.rows[0].userrole,
                },
              });
            }
          }
        );
      }
    );
  });
};

const removeMember = (req, res) => {
  const { groupid, userid } = req.params;
  // check if group exists
  db.query('SELECT * FROM groups WHERE id = $1', [groupid], (err, group) => {
    if (!group.rows[0]) {
      return res.status(404).json({
        status: 'Failed',
        error: 'No group with that id found',
      });
    }
    // if group exists, check if user making the request is authorized to do so
    if (group.rows[0].adminid !== req.decoded.sub) {
      return res.status(403).json({
        status: 'Failed',
        error: 'Only group admin is allowed to modify group',
      });
    }
    // delete user if found in groupmember table
    db.query(
      'DELETE FROM groupmembers WHERE memberid = $1 AND groupid = $2',
      [userid, groupid],
      (err, member) => {
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'User removed from group successfully',
          },
        });
      }
    );
  });
};

module.exports = {
  addUserToGroup,
  postGroup,
  removeMember,
};
