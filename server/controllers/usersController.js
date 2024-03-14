const User = require("../models/user");
const passport = require("passport");

const getParams = (body) => {
    let params = {        
        name: body.name,
        email: body.email,
        password: body.password,
        balance: body.balance,
    }
    return params;
};

module.exports = {

	// Display the next view according to the redirect path
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

	// Add a new user to the database
	create: (req, res, next) => {
		// Skip if validation failed
		if (req.skip) {
			res.locals.redirect = "/users/new";
			return next();
		}
		let newUser = getParams(req.body);
		User.register(newUser, req.body.password, (error, user) => {
			if (user) {
				next();
			} else {
				res.locals.redirect = "/users/new";
				next();
			}
		});
	},

    // Return a promise of one user
    show: (req, res, next) => {
		let userId = req.params.id;
		User.findById(userId)
		.then((user) => {
			res.locals.redirect = "/";
			res.locals.user = user;
			next();
		})
		.catch((error) => {
			console.log(`Error fetching user by ID: ${error.message}`);
			next(error);
		});
    },

    // Update a user's account information
    updateInfo: (req, res, next) => {
		let userId = req.params.id;
        // Skip if validation failed
        if (req.skip) {
			res.locals.redirect = "/";
			return next();
		}
        let userParams = getParams(req.body);
		User.findByIdAndUpdate(userId, { $set: userParams })
            .then((user) => {
				console.log(`${user.name}'s account was updated.`);
                res.locals.redirect = "/";
                res.locals.user = user;
                next();
            })
            .catch((error) => {
                console.log(`Error updating user by ID: ${error.message}`);
                next(error);
            });
	},

	// Update a user's balance
	updateBalance: (req, res, next) => {
		let userId = req.params.id;
		// Skip if validation failed
		if (req.skip) {
			res.locals.redirect = "/";
			return next();
		}
		let userParams = getParams(req.body);	

		// currently no validation on amount 
		// i.e. user can send more money than they have
        User.findByIdAndUpdate(userId, { balance: { $inc: userParams["balance"] }})
		.then((user) => {
			console.log(`${user.name}'s balance was updated.`);
			res.locals.redirect = "/";
			res.locals.user = user;
			next();
		})
		.catch((error) => {
			console.log(`Error updating user by ID: ${error.message}`);
			next(error);
		});
    },

	// Remove a user from the database
    delete: (req, res, next) => {
        let userId = req.params.id;
        User.findByIdAndRemove(userId)
            .then(() => {
				console.log(`${user.name}'s account was deleted.`);
                res.locals.redirect = "/";
                next();
            })
            .catch((error) => {
				console.log(`Failed to delete user account because: ${error.message}`);
                next(error);
            });
    },

    // Perform login
    authenticate: passport.authenticate("local", {
		failureRedirect: "/login",
		successRedirect: "/",
	}),

	// Check if user is logged in
	isAuthenticated: (req, res, next) => {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect("/login");
		}
	},

	// Perform logout
	logout: (req, res, next) => {
		req.logout(function (err) {
			if (err) return next(err);
			res.locals.redirect = "/";
			next();
		});
	},

	// Data validation/sanitization
	validate: (req, res, next) => {
		req.check("name", "Name is required").notEmpty();
		req.sanitizeBody("email").normalizeEmail({ all_lowercase: true }).trim();
		req.check("email").notEmpty().withMessage("Email is required")
						.isEmail().withMessage("Email is invalid");
		req.check("password", "Password is required").notEmpty();
		
		req.getValidationResult().then((error) => {
			if (!error.isEmpty()) {
				let messages = error.array({onlyFirstError: true}).map((e) => e.msg);
				req.skip = true;
			}
			next();
		});
	},

};