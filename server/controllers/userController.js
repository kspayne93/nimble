module.exports = {
	getUserById: async (req, res, next) => {
		const { user_id } = req.params;
		const db = req.app.get('db');
		try {
			let user = await db.user.get_user_by_id({ user_id });
			res.status(200).send(user[0]);
		} catch (err) {
			err.message = 'Unable to get user..';
			next(err);
		}
	},
	getUserByEmail: async (req, res, next) => {
		const { email } = req.body;
		const db = req.app.get('db');
		try {
			let foundUser = await db.user.get_user_by_email({ email });
			res.status(200).send(foundUser);
		} catch(err) {
			err.message = 'Unable to get user by email.';
			next(err);
		}
	},
	// editUserDetails: async (req, res, next) => {
	// 	const { first_name, last_name, email } = req.body;
	// 	const db = req.app.get('db');
	// 	try {

	// 	} catch (err) {
	// 		err.message = 'Unable to update user details.';
	// 		next(err);
	// 	}
	// }
}
