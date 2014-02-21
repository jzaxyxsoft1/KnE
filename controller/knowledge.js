var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
var Svc=require('Svc').Svc;
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'detail':
            var id = req.query['id'];
            res.render('knowledge/detail.ejs', {id: id});
            break;
        case 'define':
            res.render('knowledge/define.ejs')
            break;
        case 'edit':
            res.render('knowledge/edit.ejs', {id: req.query['id']});
            break;
        case 'deldefine':
            var id = req.query['id'];
            async.parallel(
                {
                    define: function (cb) {
                        cb(null,Svc.getGVObj('BODefine',function (i){return i.Parent.Value==id;}));
                    },
                    knowledge: function (cb) {
                        db.Knowledge.findOne({'Define.Value':id},{Name:1},cb);
                    }

                }, function (e, result) {
                    if (result.define || result.knowledge) {
                        res.json({msg:false,error:'类别使用中,不能删除!'});
                    }
                    else{
                        Svc.remove('BODefine',{_id:id},function (e){
                            res.json({msg:e ==null,error:e});
                        })

                    }
                })
            break;
    }
}

