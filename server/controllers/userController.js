module.exports = {
  getUserById: async (req, res, next) => {
    const { user_id } = req.params;
    const db = req.app.get('db');
    try {
      let user = await db.user.get_user_by_id({ user_id });
      res.status(200).send(user[0]);
    } catch (err) {
      err.clientMessage = 'Unable to get user..';
      next(err);
    }
  },
  getUserByEmail: async (req, res, next) => {
    const { email } = req.body;
    const db = req.app.get('db');
    try {
      let foundUser = await db.user.get_user_by_email({ email });
      res.status(200).send(foundUser);
    } catch (err) {
      err.clientMessage = 'Unable to get user by email.';
      next(err);
    }
  },
  updateUserDetails: async (req, res, next) => {
    const { user_id } = req.params;
    const { first_name, last_name, email, color } = req.body;
    const db = req.app.get('db');
    try {
      let updatedUser = await db.user.update_user({
        user_id,
        first_name,
        last_name,
        email,
        color,
      });
      req.session.loggedInUser = updatedUser[0];
      res.status(200).send(updatedUser[0]);
    } catch (err) {
      err.clientMessage = 'Unable to update user details.';
      next(err);
    }
  },
  updateMostRecentProject: async (req, res, next) => {
    const { user_id } = req.params;
    const { projectId } = req.body;
    const db = req.app.get('db');

    try {
      let updatedUser = await db.user.update_most_recent_project({ user_id, projectId });
      req.session.loggedInUser.most_recent_project = updatedUser[0].most_recent_project;
      res.status(200).send(updatedUser[0]);
    } catch (err) {
      err.clientMessage = 'Unable to update most recent project';
      next(err);
    }
  },
};
