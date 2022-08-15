const User = require(`../models/User`);
const ApiError = require(`../models/ApiError`);
const { ADMIN, BOSS, REGULAR_USER } = require('../entities/roles');


const getUsers = async ({ _id, role }) => {
  let users = [];

  if (role === ADMIN) {
    users = await User.find();
  } else if (role === BOSS) {
    users = await getUsersRecursively(_id);
  } else if (role === REGULAR_USER) {
    const user = await User.findById(_id);
    users.push(user);
  }

  const getUsersRecursively = async (id) => {
    const user = await User.findById(id);
    users.push(user);

    if (user.subordinates_ids.length > 0) {
      await Promise.all(user.subordinates_ids.map(id => () => getUsersRecursively(id)));
    }    
  }

  return users;
}

const changeBoss = async (subordinate_user_id, new_boss_id, current_user) => {
  let [subordinate_user, new_boss] = await Promise.all([
    getUser(subordinate_user_id),
    getUser(new_boss_id),
  ]);

  if (subordinate_user._id.valueOf() === current_user._id) {
    throw ApiError.badRequest(`Rejected. You cannot change the boss of yourself`);
  }
  if (subordinate_user.boss_id.valueOf() === new_boss._id.valueOf()) {
    throw ApiError.badRequest(`Rejected. Users are already a boss and a subordinate`);
  }

  const user_is_subordinate = await isSubordinate(subordinate_user._id, current_user._id, false);
  if(!user_is_subordinate) {
    throw ApiError.badRequest(`Rejected. User ${subordinate_user.email} is not your subordinate`);
  }

  if (new_boss._id.valueOf() !== current_user._id) {
    const new_boss_is_subordinate = await isSubordinate(new_boss._id, current_user._id, false);
    if(!new_boss_is_subordinate) {
      throw ApiError.badRequest(`Rejected. User ${new_boss.email} is not your subordinate`);
    }
  }

  const new_boss_is_subordinate_of_subordinate_user = await isSubordinate(new_boss._id, subordinate_user._id, false);
  if(new_boss_is_subordinate_of_subordinate_user) {
    throw ApiError.badRequest(`Rejected. Hierarchy conflict: you cannot make a subordinate user to be the boss of his boss`);
  }

  let old_boss = await getUser(subordinate_user.boss_id);

  subordinate_user = await User.findByIdAndUpdate(subordinate_user._id, {boss_id: new_boss._id}, {new: true});
  
  new_boss.subordinates_ids.push(subordinate_user._id)
  new_boss = await User.findByIdAndUpdate(new_boss._id, {subordinates_ids: new_boss.subordinates_ids}, {new: true});
  if (new_boss.subordinates_ids.length === 1) {
    new_boss = await User.findByIdAndUpdate(new_boss._id, {role: BOSS}, {new: true});
  }

  old_boss.subordinates_ids = old_boss.subordinates_ids.filter(id => id != subordinate_user._id)
  old_boss = await User.findByIdAndUpdate(old_boss._id, {subordinates_ids: old_boss.subordinates_ids}, {new: true});
  if (old_boss.subordinates_ids.length === 0) {
    old_boss = await User.findByIdAndUpdate(old_boss._id, {role: REGULAR_USER}, {new: true});
  }

  return {subordinate_user, new_boss, old_boss};
}

const isSubordinate = async (subordinate_id, id, result) => {
  const user = await User.findById(id);
  if (user.subordinates_ids.includes(subordinate_id)) {
    result = true;
    return result;
  }
  if (user.subordinates_ids.length > 0) {
    for (const element of user.subordinates_ids) {
      result = await isSubordinate(subordinate_id, element, result);
      if (result) break;
    }
  }

  return result;
}

const getUser = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw ApiError.badRequest(`User with id: ${id} is not found`)
  }
  return user;
}

module.exports = { getUsers, changeBoss };