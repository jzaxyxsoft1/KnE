/**
 * Created by wdg on 14-2-20.
 */
exports.get=function (req,res){
    var t= req.query['t'].toLowerCase();
    switch (t){
        case 'edit': //编辑
            res.render('user/edit.ejs')
            break;
        case 'role': //角色
            res.render('user/role.ejs');
            break;

    }
}