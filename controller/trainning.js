/**
 * Created by wdg on 14-2-20.
 */
var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
var TrainningSvc=require('Svc').TrainningSvc;
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'p': //pad page
            res.render('trainning/p.ejs', {u: req.currentUser });
            break;
        case 'plan': //计划
            res.render('trainning/plan.ejs',{m:true})
            break;
        case 'getuserplan':
            TrainningSvc.getUserTrainningKnowledges(req.currentUser._id, function(e,ds){
                res.json(ds)
            })
            break;
        case 'planknowledgedefines':
            var id= req.query['id'];
            async.waterfall([
                function (wcb){
                    db.TrainningPlan.findOne({_id:id},{KnowledgeDefineIDs:1},wcb);
                },
                function (plan,wcb){
                    db.BODefine.find({_id:{$in:plan.KnowledgeDefineIDs}},{Name:1}).toArray( wcb)
                }
            ],function (e,o){
                res.json(o);
            })
            break;


    }
}