const express = require("express"),
	path = require("path"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
// security update broke old code, but overall functionality still ok
//    expressValidator = require("express-validator"),
	passport = require("passport"),

	User = require("./models/user"),

    errorController = require("./controllers/errorController"),
    usersController = require("./controllers/usersController"),

    app = express(),
    router = express.Router();

/*  Manually create MongoDB database called "buffr" */
mongoose.connect("mongodb://0.0.0.0:27017/buffr");
const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to mongodb!");
});

app.set("port", process.env.PORT || 3000);
app.use(express.json());
// app.use(express.urlencoded());
app.use(express.static(path.resolve(__dirname, '../frontend/build')));

router.use(methodOverride("_method", {
        methods: ["POST", "GET"],
    }));
router.use(cookieParser("secret-pascode"));
router.use(expressSession({
    secret: "secret_passcode",
    cookie: {
        maxAge: 40000,
    },
    resave: false,
    saveUninitialized: false,
	}));
router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});
  
app.use("/", router);

// User login/logout
router.post("/login", usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);

// Get user info
router.get("/:id", usersController.show, usersController.redirectView);

// Create, update, delete users
router.post("/users/create",
//	usersController.validate,
	usersController.create,
	usersController.redirectView);
router.put("/users/:id/updateInfo", 
	usersController.isAuthenticated, 
//	usersController.validate,
	usersController.updateInfo,
	usersController.redirectView);
router.put("/users/:id/updateBalance",
	usersController.isAuthenticated, 
	usersController.updateBalance,
	usersController.redirectView);
router.delete("/users/:id/delete",
	usersController.isAuthenticated, 
	usersController.delete,
	usersController.redirectView);

// Error handlers
// router.use(errorController.respondSourceNotFound);
// router.use(errorController.respondInternalError);

// All other GET requests not handled before will return to React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/', 'index.html'));
});

app.listen(app.get("port"), () => {
    console.log(`The server is running at http://localhost:${app.get("port")}`);
});
