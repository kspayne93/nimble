module.exports = {
   getProjectsByUserId: async (req, res) => {
      const { user_id } = req.params;
      const db = req.app.get('db');
      try {
         let projects = await db.project.get_projects_by_user_id({ user_id });
         res.status(200).send(projects);
      }
      catch (err) {
         console.log(err);
      }
   },
   getProjectById: async (req, res) => {
      const { project_id } = req.params;
      const db = req.app.get('db');
      try {
         let project = await db.project.get_project_by_id({ project_id });
         res.status(200).send(project);
      }
      catch (err) {
         console.log(err);
      }
   },
   getProjectUsers: async (req, res) => {
      const { project_id } = req.params;
      const db = req.app.get('db');
      try {
         let users = await db.project.get_project_users({ project_id });
         res.status(200).send(users);
      } catch (err) {
         console.log(err);
      }
   },
   createProject: async (req, res) => {
      const { title, created_by } = req.body;
      const created_at = new Date();
      const archived = false;
      const list_order = [];
      const db = req.app.get('db');
      try {
         let added = await db.project.create_project({
            title, list_order, created_at, created_by, archived,
         });
         res.status(200).send(added[0]);
      }
      catch (err) {
         console.log(err)
      }
   },
   updateProject: async (req, res) => {
      const { project_id } = req.params;
      const { title, list_order } = req.body;
      const db = req.app.get('db');
      try {
         let updatedProject = await db.project.update_project({ project_id, title, list_order });
         res.status(200).send(updatedProject);
      } catch (err) {
         console.log(err);
      }
   },
   addProjectUser: async (req, res) => {
      const { project_id, user_id } = req.params;
      const db = req.app.get('db');
      try {
         let addedUser = await db.project.add_project_user({ project_id, user_id });
         res.status(200).send(addedUser[0]);
      } catch (err) {
         console.log(err);
         res.status(400).send({
            message: 'Error adding user to project. Please try again.'
         })
      }
   },
   removeProjectUser: async (req, res) => {
      const { project_id, user_id } = req.params;
      const db = req.app.get('db');
      try {
         let removedUser = await db.project.remove_project_user({ project_id, user_id });
         res.status(200).send(removedUser[0]);
      } catch(err) {
         console.log(err);
         res.status(400).send({
            message: 'Error removing user from project. Please try again.'
         })
      }
   },
};