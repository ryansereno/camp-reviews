module.exports.isLoggedIn = (req,res,next)=>{
    console.log('Req.user...', req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl //stores the from url in the session so that it can be used as a redirect (see user.js router)
        req.flash('error','Must be logged in')
        return res.redirect('/login')
    }
    next()
}
