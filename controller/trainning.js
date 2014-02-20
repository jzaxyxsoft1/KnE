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
            res.render('trainning/p.ejs', {u: req.currentUser, isPad: true});
            break;
        case 'plan': //计划
            res.render('trainning/plan.ejs')
            break;
        case 'getuserplan':
            async.parallel({
                roles: function (cb) {
                    db.Role.find({RoleIDs: req.currentUser._id}).toArray(cb)
                },
                plans: function (cb) {
                    db.TrainningPlan.find({ETime: {$le: Date.ToDateTimeString()}}).toArray(cb)
                }
            }, function (e, result) {
                var tps = _.filter(result.plans, function (i) {
                    return _.any(i.RoleIDs, function (ri) {
                        return _.any(result._id == ri);
                    });
                });
                if (tps.length > 0) {
                   var kdids = _.chain(tps)
                       .map(function (i){return i.KnowledgDefineIDs})
                       .union()
                       .uniq()
                       .value();
                    db.Knowledge.find({"Define.Value":{$in:kdids}},{Define:1,Name:1}).toArray(function (e,ds){
                        res.json(ds);
                    })
                }
                else {
                    res.json([]);
                }
            });

            break;
        case 'planknowledgedefines':
            var id= req.query['id'];
            async.waterfall([
                function (wcb){
                    db.TrainningPlan.findOne({_id:id},{KnowledgeIDs:1},wcb);
                },
                function (dids,wcb){
                    db.BODefine.find({_id:{$in:dids}},{Name:1},wcb)
                }
            ],function (e,o){
                res.json(o);
            })
            break;
    }
}