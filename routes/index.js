/*
 * GET home page.
 */
var Svc = require('Svc');
var db = require('DB').DB;
exports.index = function (req, res) {
    var m= req.query['m'];
    res.render('index', {msg: m?true:null });
};
exports.main = function (req, res) {
    res.render('main.ejs',{isPad:true,u:req.currentUser})
}
exports.postl = function (req, res) {
    var n = req.body['n'];
    var p = req.body['p'];

    db.OrgUser.findOne({Name:n,Pwd:p},function (e,o){
        if(o!=null){
            Svc.HttpHelper.Cookie.set(res,Svc.HttpHelper.Cookie.defaultUserCookieName,{Name: o.Name,_id: o._id});
            res.redirect('/main');
        }
        else{
            res.redirect('/index?m=1')
        }
    });
}