DELETE FROM task_users
WHERE project_id = ${project_id}
AND user_id = ${user_id}

RETURNING *;