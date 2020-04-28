//=====================================================================
//                          Package Requirements
//=====================================================================
const express                =     require('express'),
     app                     =     express(),
     bodyParser              =     require('body-parser')
     mongoose                =     require("mongoose"),
     campground              =     require('./models/campground'),
     seedDB                  =     require('./seed'),
     Comment                 =     require('./models/comment'),
      passport               =     require('passport'),
      localStrategy          =     require("passport-local"),
      passportLocalMongoose  =     require("passport-local-mongoose"),
      User                   =     require('./models/user');
      methodOverride         =     require('method-override');
//  ===========================================================================
//                             Requiring Routes
//  ==========================================================================
var campgroundRoute  = require('./routes/campgrounds');
var commentRoute     = require('./routes/comments');
var indexRoute       = require('./routes/index');
//=============================================================================
//                     Database Connection
// ============================================================================                              
mongoose.connect("mongodb://mongo:27017/yelp_camp",{useNewUrlParser:true});
//this is seed file
// seedDB();
//===========================================================================
//                              passport Configuration
//======================================================================
app.use(require('express-session')({
    secret:'web dev bootcamp',
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//================================================================
//                      app configuration
//===============================================================
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    next();
});
app.use(methodOverride("_method"));
app.use('/campgrounds',campgroundRoute);
app.use('/campgrounds/:id/comments',commentRoute);
app.use('/',indexRoute);

//============================================
//              starting Server
//=============================================
app.listen(process.env.PORT||3000,()=>{
    console.log('server has started');  
});
