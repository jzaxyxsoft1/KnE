var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'edit':
            res.render('question/edit.ejs')
            break;
        case 'examquestions':
            var id = req.query['id']; //ExamDefine  id
            async.waterfall([
                function (wcb) {
                    db.ExamDefine.findOne({_id: id}, function (e, d) {
                        wcb(null, d.Items);
                    });
                },
                function (qts, wcb) {
                    var dids = _.map(qts, function (i) {
                        return i._id;
                    });
                    var qids = [];
                    db.Question.find({_id: {$in: dids}}, {DefineID: 1}, function (e, ds) {
                        //问题类型遍历
                        _.each(qts, function (di) {
                            var ids = _.filter(ds, function (qi) {
                                return qi.DefineID == di._id
                            });
                            if (ids.length <= di.Value) { //问题数小于 设定数
                                qids = _.union(qids, _.map(function (qi) {
                                    return qi._id
                                }))
                            }
                            else {
                                var rss = _.chain(ids).map(function (i){return i._id}).sample(di.Value).value; //随机问题 id
                                qids = _.union(qids,rss);
                            }
                        });
                        wcb(null, qids);
                    });
                },
                function (qids, wcb) {
                    db.Question.find({_id:{$in:qids}},wcb);
                }
            ], function (e, ds) {
                res.json(ds);
            })
            break;
    }
}