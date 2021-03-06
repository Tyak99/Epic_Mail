import { validationResult } from 'express-validator/check';
import db from '../database/index';

const getAllGroups = (req, res) => {
  const { sub } = req.decoded;
  db.query('SELECT * FROM  groups WHERE adminid = $1', [sub], (err, groups) => {
    if (!groups.rows[0]) {
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'You currently have no group created',
        },
      });
    }
    const result = [];
    groups.rows.map((element) => {
      const obj = {
        id: element.id,
        name: element.name,
        role: 'admin',
      };
      result.push(obj);
    });
    if (groups.rows[0]) {
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    }
  });
};

const getGroupMembers = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  const { groupid } = req.params;
  db.query('SELECT * FROM groups WHERE id = $1', [groupid], (err, group) => {
    if (!group.rows[0]) {
      return res.status(404).json({
        status: 'success',
        error: 'Group not found',
      });
    }
    db.query(
      'SELECT * FROM groupmembers WHERE memberid = $1',
      [req.decoded.sub],
      (err, isMember) => {
        if (!isMember.rows[0]) {
          return res.status(403).json({
            status: 'failed',
            error:
              'You can only get group members of groups you are a member of',
          });
        }
        db.query(
          'SELECT firstname, lastname, id FROM users, groupmembers WHERE groupid = $1 AND id = memberid',
          [groupid],
          (err, user) => {
            return res.status(200).json({
              status: 'success',
              data: user.rows,
            });
          }
        );
      }
    );
  });
};
const postGroup = (req, res) => {
  const { name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
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

const updateGroup = (req, res) => {
  const { groupid } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
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
      'UPDATE groups SET name = $1 WHERE id = $2 RETURNING *',
      [req.body.name, groupid],
      (err, updatedGroup) => {
        if (updatedGroup.rows[0]) {
          return res.status(200).json({
            status: 'success',
            data: updatedGroup.rows[0],
          });
        }
      }
    );
  });
};

const addUserToGroup = (req, res) => {
  const { groupid } = req.params;
  const userId = req.decoded.sub;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
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
      return res.status(403).json({
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
        if (memberid == req.decoded.sub) {
          return res.status(409).json({
            status: 'failed',
            error: 'You are a already a member of this group',
          });
        }
        db.query(
          'SELECT * FROM groupmembers WHERE memberid = $1 AND groupid = $2',
          [memberid, groupid],
          (err, groupCheck) => {
            if (groupCheck.rows[0]) {
              return res.status(409).json({
                status: 'failed',
                error: 'User already exists in group',
              });
            }
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
      }
    );
  });
};

const removeMember = (req, res) => {
  const { groupid, userid } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
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
    if (group.rows[0].adminid == userid) {
      return res.status(422).json({
        status: 'failed',
        error: 'admin cannot be removed from group',
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
            error: 'user does not exist in group',
          });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  // i will check the group table to see if the group exists
  db.query(
    'SELECT * FROM groups WHERE name = $1',
    [req.body.groupname],
    (err, group) => {
      if (!group.rows[0]) {
        return res.status(404).json({
          status: 'failed',
          error: 'No group with that name found',
        });
      }
      db.query(
        'SELECT * FROM groupmembers WHERE groupid = $1',
        [group.rows[0].id],
        (err, groupmembers) => {
          // the arrays of all the members in the group
          const allGroupMembers = groupmembers.rows.filter((member) => {
            return member.memberid !== req.decoded.sub;
          });
          if (allGroupMembers.length < 1) {
            return res.status(406).json({
              status: 'failed',
              error: 'No other member in group to send message to',
            });
          }
          const membersSentTo = allGroupMembers.length;
          // subject and message passed in the request body
          const { subject, message } = req.body;
          const newSubject = subject.replace(/\s+/g, ' ');
          const newMessage = message.replace(/\s+/g, ' ');
          // getting the sender id from the token validator middleware
          const senderid = req.userEmail;
          // mapping through the array of groupmembers to post them a message with an async functioin
          const sendMessages = () => {
            return new Promise((resolve, reject) => {
              allGroupMembers.map((member) => {
                let memberEmail = '';
                db.query(
                  'SELECT * FROM users WHERE id = $1',
                  [member.memberid],
                  (err, user) => {
                    memberEmail = user.rows[0].email;
                    if (user.rows[0]) {
                      db.query(
                        'INSERT INTO messages (subject, message, status, senderid, receiverid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                        [
                          newSubject,
                          newMessage,
                          'unread',
                          senderid,
                          memberEmail,
                        ],
                        (err, postedMessages) => {
                          resolve(postedMessages);
                        }
                      );
                    }
                  }
                );
              });
            });
          };
          const initializeSendMessage = sendMessages();
          initializeSendMessage.then((result) => {
            const {
              id,
              message,
              subject,
              parentmessageid,
              created_at,
            } = result.rows[0];
            return res.status(200).json({
              status: 'success',
              data: {
                id,
                message,
                subject,
                parentmessageid,
                created_at,
                members_sent_to: membersSentTo,
              },
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
  getAllGroups,
  updateGroup,
  getGroupMembers,
};
