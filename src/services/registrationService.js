const User = require(`../models/User`);
const ApiError = require(`../models/ApiError`);
const { REGULAR_USER, ADMIN } = require('../entities/roles');


const checkAndFormatUserData = async (userData) => {
	const { email, password } = userData;

	
	const [admin, user] = await Promise.all([
		getAdmin(),
		User.findOne({ email }),
	]);

	if (user) {
		throw ApiError.badRequest(`User with email '${email}' already exists`);
	}

	return new User(
		{
			email,
			password,
			role: REGULAR_USER,
			boss_id: admin._id,
		}
	);
};

const createUser = async (user) => {
	const admin = await getAdmin();
	const new_user = await User.create(user);
	admin.subordinates_ids.push(new_user._id);	
	await User.findByIdAndUpdate(admin._id, {subordinates_ids: admin.subordinates_ids});
	
	return new_user;
};

const getAdmin = async () => {
	const adminQuery = await User.find({role: ADMIN});
	if (!adminQuery.length) {
		throw ApiError.internal(`Administrator not found`);
	}

	return adminQuery[0];
}

module.exports = { checkAndFormatUserData, createUser };
