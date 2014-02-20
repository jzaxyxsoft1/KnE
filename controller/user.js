/**
 * Created by wdg on 14-2-20.
 */
var db = require('DB').DB;
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'edit': //编辑
            res.render('user/edit.ejs')
            break;
        case 'role': //角色
            res.render('user/role.ejs');
            break;
        case 'changepwd':
            var op = req.query['op'];
            if (op) {
                var np = req.query['np'];
                db.OrgUser.findOne({_id: req.currentUser._id}, {Pwd: 1}, function (e, d) {
                    if (op !== d.Pwd) {
                        res.json({error: '原密码错误!'});
                    }
                    else {
                        db.OrgUser.update({_id: req.currentUser._id}, {$set: {Pwd: np}}, function (e) {
                            res.json({error: e});
                        });
                    }
                })
            }
            else {
                res.render('user/changepwd.ejs');
            }
            break;
        case 'resetpwd':
            var id = req.query['id'];
            db.OrgUser.update({_id: id}, {$set: {Pwd: '8888'}}, function (e) {
                res.json({msg: e == null, error: e});
            })
            break;
    }
}