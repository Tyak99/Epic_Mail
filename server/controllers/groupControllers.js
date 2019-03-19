
exports.postGroup = (req, res) => {
  const { name, members } = req.body;
  if (!name || !members) {
    return res.send({
      status: 400,
      error: 'Provide the neccessary details',
    });
  }
};
