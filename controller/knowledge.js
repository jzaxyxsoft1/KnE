var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
exports.get=function (req,res){
    var t= req.query['t'].toLowerCase();
    switch (t){
        case 'detail':
            var id= req.query['id'];
            res.render('knowledge/detail.ejs',{id:id});
            break;
        case 'define':
            res.render('knowledge/define.ejs')
            break;
        case 'edit':
            res.render('knowledge/edit.ejs',{id:req.query['id']});
            break
    }
}
