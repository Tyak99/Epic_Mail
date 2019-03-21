import db from '../database/index';

const postGroup = (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      status: 'failed',
      error: 'Provide the neccessary details',
    });
  }
  db.query('SELECT * FROM groups WHERE name = $1', [name], (err, data) => {
    if (data.rows[0]) {
      return res.status(409).json({
        status: 'failed',
        error: 'group name already exist',
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
    if (!group.rows[0]) {
      return res.status(404).json({
        status: 'failed',
        error: 'Group does not exist',
      });
    }
    // if it exists, check if the user sending the request is an admin
    if (group.rows[0].adminid !== userId) {
      return res.status(401).json({
        status: 'failed',
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
            status: 'failed',
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
        status: 'failed',
        error: 'No group with that id found',
      });
    }
    // if group exists, check if user making the request is authorized to do so
    if (group.rows[0].adminid !== req.decoded.sub) {
      return res.status(403).json({
        status: 'failed',
        error: 'Only group admin is allowed to modify group',
      });
    }
    // delete user if found in groupmember table
    db.query(
      'DELETE FROM groupmembers WHERE memberid = $1 AND groupid = $2 RETURNING *',
      [userid, groupid],
      (err, member) => {
        if (!member.rows[0]) {
          return res.status(404).json({
            status: 'failed',
            error: 'user does not exist in group'
          })
        }
        if (member.rows[0]) {
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'User removed from group successfully',
            },
          });
        }
      }
    );
  });
};

const deleteGroup = (req, res) => {
  const { groupid } = req.params;
  // check if the group exists in the db
  db.query('SELECT * FROM groups WHERE id = $1', [groupid], (err, group) => {
    if (!group.rows[0]) {
      return res.status(404).json({
        status: 'failed',
        error: 'Group does not exist',
      });
    }
    if (group.rows[0].adminid !== req.decoded.sub) {
      return res.status(403).json({
        status: 'failed',
        error: 'Error! Only group admin can delete group',
      });
    }
    db.query(
      'DELETE FROM groups WHERE id = $1 RETURNING *',
      [groupid],
      (err, deletedGroup) => {
        if (deletedGroup.rows[0]) {
          return res.status(200).json({
            status: 'success',
            data: {
              message: 'Group deleted successfully',
            },
          });
        }
      }
    );
  });
};

const postGroupMessage = (req, res) => {
  // i will check the group table to see if the group exists
  db.query(
    'SELECT * FROM groups WHERE id = $1',
    [req.params.groupid],
    (err, group) => {
      if (!group.rows[0]) {
        return res.status(404).json({
          status: 'failed',
          error: 'No group with that id found',
        });
      }
      db.query(
        'SELECT * FROM groupmembers WHERE groupid = $1',
        [req.params.groupid],
        (err, groupmembers) => {
          // the arrays of all the members in the group
          const allGroupMembers = groupmembers.rows;
          // subject and message passed in the request body
          const { subject, message } = req.body;
          // getting the sender id from the token validator middleware
          const senderid = req.decoded.sub;
          // mapping through the array of groupmembers to post them a message with an async functioin
          const sendMessages = () => {
            return new Promise((resolve, reject) => {
              allGroupMembers.map((member) => {
                db.query(
                  'INSERT INTO messages (subject, message, status, senderid, receiverid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                  [subject, message, 'unread', senderid, member.memberid],
                  (err, postedMessages) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(postedMessages);
                    }
                  }
                );
              });
            });
          };
          const initializeSendMessage = sendMessages();
          initializeSendMessage.then((result) => {
            const { id, message, subject, status, parentmessageid, created_at } = result.rows[0]
            return res.status(200).json({
              status: 'success',
              data: {
                id,
                message,
                subject,
                status,
                parentmessageid,
                created_at
              }
            });
          });
        }
      );
    }
  );
};

module.exports = {
  addUserToGroup,
  postGroup,
  removeMember,
  deleteGroup,
  postGroupMessage,
};
