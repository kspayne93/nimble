const userController = require('./controllers/userController');
const projectController = require('./controllers/projectController');
const listController = require('./controllers/listController');
const taskController = require('./controllers/taskController');
const connectionController = require('./controllers/connectionController');
const authController = require('./controllers/authController');

const express = require('express');
const massive = require('massive');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const { PORT, DEV_PORT, DATABASE_URL, SECRET } = process.env;
const port = PORT || DEV_PORT;
const app = express();

// MIDDLEWARE
app.use(express.static( `${__dirname}/../build` ));
app.use(express.json());
app.use(session({
   secret: SECRET,
   resave: false,
   saveUninitialized: false,
}));
app.use((req, res, next) => { // authentication before every request
   if (
      req.url !== '/api/auth/login' &&
      req.url !== '/api/auth/register' &&
      req.url !== '/api/auth/logout' &&
      !req.session.loggedInUser
      ) {
      res.status(401).send('Please log in.');
   } else {
      next();
   }
});

// DATABASE CONNECTION
massive(DATABASE_URL)
   .then(db => {
      app.set('db', db)
      console.log(('Connected to database'));
      app.listen(port, () => {
         console.log(`Listening on port: ${port}`);
      })
   })
   .catch(err => console.log(`Error connecting to database: ${err}`));

// ENDPOINTS
// Project
app.get('/api/project/:project_id', projectController.getProjectById); // Get project by Id
app.get('/api/project/:project_id/users', projectController.getProjectUsers) // Get all project users
app.get('/api/project/:project_id/permissions', projectController.getProjectPermissions) // Get Project Permissions
app.post('/api/project', projectController.createProject); // Create Project
app.post('/api/project/:project_id/user/:user_id', projectController.addProjectUser) // Add User to Project (Collaborator)
app.put('/api/project/:project_id', projectController.updateProject); // Update Project
app.put('/api/project/:project_id/permissions', projectController.updateProjectPermissions) // Update Project Permissions
app.delete('/api/project/:project_id/user/:user_id', projectController.deleteProjectUser) // Remove User from Project (Collaborator)

// User
app.get('/api/user/:user_id', userController.getUserById) // Get user by id
app.get('/api/find-user', userController.getUserByEmail) // Get user by email
app.get('/api/user/:user_id/projects', projectController.getProjectsByUserId) // Get all user's projects

// List
app.get('/api/project/:project_id/lists', listController.getLists); // Get all project lists
app.get('/api/list/:list_id', listController.getListById); // Get list by list_id
app.post('/api/project/:project_id/list', listController.createList); // Add list
app.put('/api/project/:project_id/list/:list_id', listController.updateList); // Edit List
app.delete('/api/project/:project_id/list/:list_id', listController.deleteList); // Delete list

// Task
app.get('/api/project/:project_id/tasks', taskController.getAllTasks); // Get all project tasks
app.get('/api/project/:project_id/tasks/:user_id', taskController.getTasksByUserId); // Get all tasks assigned to a specific user
app.get('/api/task_users/:project_id', taskController.getTaskUsers); // Get all task-user relationships from task_users table
app.post('/api/project/:project_id/task', taskController.createTask); // Create new task
app.post('/api/task_users/:project_id', taskController.addTaskUser) // Assign user to task
app.put('/api/task/:task_id', taskController.updateTask); // Update task
app.delete('/api/task/:task_id', taskController.deleteTask); // Delete task
app.delete('/api/tasks/list/:list_id', taskController.deleteTasksByListId)
app.delete('/api/task_users/:tu_id', taskController.deleteTaskUser) // Remove user from task
app.delete('/api/task_users/project/:project_id/user/:user_id', taskController.deleteTaskUsersByProjectAndUser) // Remove user from all tasks in project
app.delete('/api/task_users/task/:task_id', taskController.deleteTaskUsersByTask) // Delete all task_users by task_id

// Connection
app.get('/api/connection/user/:user_id', connectionController.getUserConnections); // Get all connections for user
app.post('/api/connection/user/:user_id', connectionController.addUserConnection); // Add user connection
app.put(`/connection/:connection_id`, connectionController.acceptUserConnection); // Accept user connection
app.delete('/api/connection/:connection_id/user/:user_id', connectionController.deleteUserConnection); // Remove, ignore, and cancel user connection,

// Auth
app.get('/api/auth/user_session', authController.getUserSession) // Get user session (logged in user)
app.get('/api/auth/logout', authController.logout) // Logout
app.post('/api/auth/login', authController.login); // Login
app.post('/api/auth/register', authController.register); // Register/Create new user

// Return main app file for SPA
app.get('*', (req, res)=>{
   res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Error Handler
app.use((err, req, res, next) => {
   if (!err) {
      next();
   } else {
      let statusCode = err.statusCode || 500;
      let errMessage = err.message || 'Internal Server Error.'
      res.status(statusCode).send(errMessage);
   }
});
