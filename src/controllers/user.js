const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../auth');


// Check if registered email already exists
module.exports.emailExists = (params) => {
    return User.find({ email: params.email }).then(res => {
        // return !!(res.length > 0)
        return res.length > 0 ? true : false;
    })
}

// User Registration
module.exports.register = (params) => {
    const { firstName, lastName, email, password, loginType } = params;

    let user = new User({
        firstName,
        lastName,
        email,
        password: bcrypt.hashSync(password, 10),
        loginType
    });

    return user.save().then((user, err) => {
        return err ? false : true;
    })
}

// User Login
module.exports.login = (params) => {
    const { emai, password } = params;
    return User.findOne({ emai }).then(user => {
        if (user === null) {
            return { error: 'User does not exist' };
        }
        if (user.loginType !== 'email') {
            return { error: 'Login type error' };
        }

        const isPasswordMatched = bcrypt.compareSync(password, user.password);

        if (isPasswordMatched) {
            return { accessToken: auth.createAccessToken(user.toObject()) };
        } else {
            return { error: 'Incorrect password!' };
        }
    })
}

// Get user details
module.exports.get = (params) => {
    return User.findById(params.userId).then(user => {
        // user.password = undefined ??
        return user;
    })
}

// Adding of new category
module.exports.addCategory = (params) => {
    const { userId, name, type } = params;
    return User.findById(userId).then(user => {
        user.categories.push({
            name,
            type
        })
        return user.save().then((user, err) => {
            return err ? false : true;
        })
    })
}

// Update of category
module.exports.updateCategory = (params) => {
    return User.updateOne(
        {
            _id: params.userId,
            "categories._id": params.categoryId
        },
        {
            $set: {
                "categories.$.name": params.name,
                "categories.$.type": params.type
            }
        }
    ).then((user, err) => {
        return err ? false : true;
    })
}

// Adding of new record
module.exports.addRecord = (params) => {
    const { userId, categoryId, categoryName, categoryType, amount, description } = params;

    return User.findById(userId).then(user => {
        user.records.push({
            categoryId,
            categoryName,
            categoryType,
            amount,
            description
        })
        return user.save().then((user, err) => {
            return err ? false : true;
        })
    })
}

// Update of record
module.exports.updateRecord = (params) => {
    const { userId, recordId, categoryId,categoryName, categoryType,amount, description } = params;

    return User.updateOne(
        {
            _id: userId,
            "records._id": recordId
        },
        {
            $set: {
                "records.$.categoryId": categoryId,
                "records.$.categoryName": categoryName,
                "records.$.categoryType": categoryType,
                "records.$.amount": amount,
                "records.$.description": description
            }
        }
    ).then((user, err) => {
        return err ? false : true;
    })
}

// Deleting of record
module.exports.deleteRecord = (params) => {
	return User.updateOne(
		{
			_id: params.userId,
			"records._id": params.recordId
		},
		{
			$set: {
				"records.$.isDeleted": true,
			}
		}
	)
	.then((user, err) => {
		return err ? false : true;
	});
}


