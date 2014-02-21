var Svc = require('Svc').Svc;
var db = require('DB').DB;
var _ = require('underscore');
var async = require('async');
var pinyin = require('pjpinyin');
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    var tp, id;
    switch (t) {
        case 'resetdata':
            async.parallel(
                {
                    user: function (pcb) {
                        db.OrgUser.find().toArray(function (e, ds) {
                            async.each(ds, function (i, acb) {
                                i.Simcode = pinyin(i.Name, '').toUpperCase();
                                db.OrgUser.update({_id: i._id}, {$set: {Simcode: i.Simcode}}, acb);
                            }, function (e) {
                                pcb(null);
                            });
                        })
                    },
                    knowledge: function (pcb) {
                        db.Knowledge.find({}, {DefineID: 1}).toArray(function (e, ds) {
                            async.each(ds, function (di, ecb) {
                                var bi = Svc.getGVObj("BODefine", function (i) {return i._id == di.DefineID});
                                di.Define = bi ? {Name: bi.Name, Value: bi._id} : {Name: '', Value: ''}
                                db.Knowledge.update({_id: di._id}, {$set: {Define: di.Define}}, ecb);
                            }, pcb);
                        })
                    },
                    kcontent: function (pcb) {
                        db.KnowledgeContent.find().toArray(function (e, ds) {
                            async.each(ds, function (i, ecb) {
                                i.Content = i.Content ? i.Content : i.Contents && i.Contents.length ? i.Contents[0] : '';
                                db.KnowledgeContent.update({_id: i._id}, {$set: {Content: i.Content}}, ecb);
                            }, pcb);
                        });
                    },
                    question: function (pcb) {
                        db.Question.find().toArray(function (e, ds) {
                            async.each(ds, function (i, ecb) {
                                var d = Svc.getGVObj("BODefine", function (di) {return di._id == i.DefineID});
                                i.Define = d ? {Name: d.Name, Value: d._id} : {Name: '', Value: ''};
                                db.Question.update({_id: d._id}, {$set: {Define: i.Define}}, ecb);
                            }, pcb);
                        });
                    }
                }, function (e, result) {
                    res.json('Done')
                })
            break;
        //        case 'boimpt':
        //            var ds = Svc.getGVObjs('BODefine', function (i) {
        //                return true;
        //            });
        //            var ns = [];
        //            var rs = _.filter(ds, function (i) {
        //                return i._id.split('.').length > 0;
        //            });
        //            rs.forEach(function (i) {
        //                var pi = i._id.split('.').pop();
        //
        //                var cs = ds.filter(function (pi) {
        //                    return pi.ParentID == i._id
        //                });
        //                _.each(cs, function (ci) {
        //                    ci.ParentID = pi;
        //                });
        //                i._id = pi;
        //            });
        //            var ns = [];
        //            ds.forEach(function (i){
        //                setP(ds,i);
        //                ns.push({_id: i._id,Name: i.Name,Parent: i.Parent,ValuePath: i.ValuePath});
        //            })
        //            db.BODefine.remove({},function (e){
        //                db.BODefine.insert(ns,function (ee,ds){
        //                    res.json(ds.length);
        //                })
        //            });
        //            break;
        case "sysfuns":
            var sfs;
            var m = req.query['m'];
            if (m == '0') {
                sfs = Svc.getGVObjs('SysFun', function (i) {
                    return i._id.length < 3;
                })
            }
            else {
                sfs = Svc.getGVObjs('SysFun', function (i) {
                    return i._id.length == 3;
                })
            }
            res.json(sfs);
            break;
        case 'adduser':
            var oid = req.query['oid'];
            Svc.db.Org.findOne({_id: oid}, function (e, org) {
                Svc.db.User.findOne({Name: 'Admin', 'Org.Value': org._id}, function (e, d) {
                    if (!d) {
                        Svc.db.User.insert({_id: Svc.db.User.ObjectID().toString(), Name: 'Admin', Simcode: 'ADMIN', Pwd: org.SMSNum, Org: {Name: org.Name, Value: org._id, Type: 'Org'}, flag: 1, TypeFullName: 'User'}, function () {
                        });
                    }
                });
            });
            break;
        case 'agg':
            Svc.db.Order.aggregate([
                                       {$match: {'Owner.Item1': '0'}},
                                       {$group: {_id: '$Owner', totle: {$sum: '$Sum'}}}
                                   ], function (e, r) {
                var t = r;
            });
            break;
        default :
            break;
    }
};
function setP(ds, o) {
    if (o.ParentID == '0') {
        o.Parent = {Name: '根类别', Value: '0'};
        o.ValuePath = "0/" + o._id;
    }
    else {
        var p = _.find(ds, function (i) {
            return i._id == o.ParentID
        });
        if (p) {
            if (p.ValuePath == undefined) {
                setP(ds, p);
            }
            o.Parent = {Name: p.Name, Value: p._id};
            o.ValuePath = p.ValuePath + '/' + o._id;
        }
    }
}

