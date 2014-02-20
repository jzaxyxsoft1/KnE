/**
 * Created by wdg on 14-2-20.
 */
var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'p': //pad page
            res.render('exam/p.ejs', {u: req.currentUser, isPad: true});
            break;
        case 'define': //考试定义
            res.render('exam/define.ejs');
            break;
        case 'userexams':
            async.waterfall([
                function (wcb){
                    db.Role.find({UserIDs:{$element:req.currentUser._id}},{Name:1}, function (e,ds){
                        ds = _.map(ds,function (i){return i._id;});
                        wcb(null,ds);
                    });
                },
                function (rids,wcb) {
                    rids = rids.join(',');
                    db.TrainningPlan.find({$where:'this.Roles.filter(function(i){return ("'+rids+'").indexOf(i)>-1})'},{Name:1},function(e,ds){
                        ds = _.map(ds,function (i){return i._id});
                        wcb()
                    })
                },
                function (pids, wcb) {
                    db.ExamDefine.find({'Plan.Value':{$in:pids}},{Name:1},wcb);
                }

            ],
                function (e, ds) {
                    res.json(ds);
                })
            break;
        case 'detail':
            var id= req.query['id'];
            res.render('exam/detail.ejs',{id:id,u:req.currentUser})
            break;
    }

}
exports.post=function (req,res){
    var t= req.body['t'].toLowerCase();
    switch (t){
        case 'saveexamresult':
            var obj= JSON.parse(req.body['obj']);
            obj._id='';
            obj.CreateTime=Date.ToDateTimeString(null,true);
            db.ExamLog.insert(obj,function (e,ds){
                res.json({msg:e==null,error:e});
            })
            brea;
    }
}