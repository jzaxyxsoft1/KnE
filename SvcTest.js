var baseSvc = require('Svc');
var Svc = baseSvc.Svc;
var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
var TrainningSvc = baseSvc.TrainningSvc;
var ExamSvc = baseSvc.ExamSvc;
var assert = require('assert');
require('Svc').init(function () {
    var trainningPlanID, knowlegDefineID, Defines, Dids, knowledges, kIds, examDefineID, user, role;
    async.series(
        {
            初始化变量: function (cb) {
                knowlegDefineID = 'testDefine';
                trainningPlanID = 'testPlan';
                user = {Name: 'testUser', _id: 'testUser'};
                role = {_id: 'testUser', Name: 'TestUser', UserIDs: [user._id]}
                examDefineID = 'testExamDefine';
                Defines = [];
                for (var i = 0; i < 3; i++) {
                    Defines.push({_id: knowlegDefineID + i, Name: 'TestKnowledgeDefineID' + i, Parent: {Name: 'Knowledge', Value: 'Knowledge'}})
                }
                Dids = _.map(Defines, function (i) {return i._id});
                knowledges = [];
                _.each(Defines, function (di) {
                    for (var i = 0; i < 10; i++) {
                        knowledges.push({_id: di._id + '0' + i, Name: di.Name + 'KKK' + i, Define: {Name: di.Name, Value: di._id}});
                    }
                });
                kIds = _.map(knowledges, function (i) {return i._id});
                console.log('初始化变量 pass');
                cb();
            },
            清理数据: function (cb) {
                async.parallel(
                    [
                        function (pcb) {db.OrgUser.remove({_id: user._id}, pcb)},
                        function (pcb) {db.Role.remove({_id: role._id}, pcb)},
                        function (pcb) {
                            var dids = _.map(Defines, function (i) {return i._id});
                            db.BODefine.remove({_id: {$in: dids}}, pcb)
                        },
                        function (pcb) {db.TrainningPlan.remove({_id: trainningPlanID}, pcb)},
                        function (pcb) {db.ExamDefine.remove({_id: examDefineID}, pcb)},
                        function (pcb) {db.Knowledge.remove({_id: {$in: kIds}}, pcb) },
                        function (pcb) {db.Question.remove({'Define.Value': {$in: Dids}}, pcb)},
                        function (pcb) {db.TrainningLog.remove({'Owner._id': user._id}, pcb)},
                        function (pcb) {db.ExamLog.remove({'Owner._id': user._id}, pcb)}
                    ], function (e) {
                        console.log('清理数据 pass');
                        cb();
                    })
            },
            生成数据: function (cb) {
                async.parallel(
                    [
                        function (pcb) {db.OrgUser.insert(user, pcb)},
                        function (pcb) {db.Role.insert(role, pcb);},
                        function (pcb) {
                            db.BODefine.insert(Defines, function (e, ds) {
                                Svc.GV.BODefine.push(Defines);
                                pcb()
                            })
                        },
                        function (pcb) {
                            db.Knowledge.insert(knowledges, pcb);
                        },
                        function (pcb) {
                            var qs = [];
                            _.each(Defines, function (di) {
                                for (var i = 0; i < 10; i++) {
                                    qs.push({_id: 'question' + di._id + i, DefineID: di._id})
                                }
                            })
                            db.Question.insert(qs, pcb);
                        },
                        function (pcb) {
                            var dt = new Date();
                            dt.setMonth(dt.getMonth() + 1);
                            db.TrainningPlan.insert(
                                {
                                    _id: trainningPlanID,
                                    KnowledgeDefineIDs: [Defines[0]._id, Defines[1]._id],
                                    RoleIDs: [role._id],
                                    ETime: Date.ToDateTimeString(dt)
                                }, pcb);
                        },
                        function (pcb) {
                            var dt = new Date();
                            dt.setMonth(dt.getMonth() + 1);
                            var ed = { _id: examDefineID, Plan: {Name: '', Value: trainningPlanID}, ETime: Date.ToDateTimeString(dt), Active: true};
                            ed.Items = [
                                {_id: Defines[0]._id, Name: Defines[0].Name, Value: 5},
                                {_id: Defines[1]._id, Name: Defines[1].Name, Value: 5}
                            ];
                            db.ExamDefine.insert(ed, pcb);
                        }
                    ], function (e) {
                        console.log('生成数据 pass');
                        cb();
                    })
            },
            获取培训计划: function (cb) {
                TrainningSvc.getUserTrainningKnowledges(user._id, function (e, ds) {
                    assert(ds != null, 'TrainningSvc.getUserTrainningKnowledges error');
                    assert(ds.length == 20, 'TrainningSvc.getUserTrainningKnowledges amount error');
                    console.log('培训计划 pass');
                    cb();
                })
            },
            培训日志: function (cb) {
                var k = _.find(knowledges, function (i) {return i.Define.Value == Defines[0]._id})
                TrainningSvc.log(user, k._id, function (e) {
                    async.parallel(
                        [
                            function (pcb) {
                                TrainningSvc.getUserTrainningKnowledges(user._id, function (e, ds) {
                                    assert(_.filter(ds,function (i) {return i.flag == 1}).length == 1, 'TrainningSvc.log status error');

                                    pcb();
                                })
                            },
                            function (pcb) {
                                db.TrainningLog.findOne({'Owner._id': user._id}, function (e, d) {
                                    assert(d != null, 'TrainningSvc.log insert error');

                                    pcb();
                                })
                            }
                        ], function (e) {
                            console.log('培训日志 pass');
                            cb();
                        });
                })
            },
            获取考试: function (cb) {
                ExamSvc.getUserExams(user._id, function (e, d) {
                    assert(d != null, 'ExamSvc.getUserExams error');
                    console.log('获取考试 pass');
                    cb();
                });
            },
            获取试题: function (cb) {
                ExamSvc.getExamQuestions(examDefineID, function (e, ds) {
                    assert(ds.length==10,'ExamSvc.getExamQuestions');
                    console.log('获取试题 pass');
                    cb();
                });
            },
            考试日志: function (cb) {
                async.waterfall(
                    [
                        function (wcb) {
                            ExamSvc.log(user, examDefineID, {TotalScore: 100, Score: 90, ScoreRate: 90.0}, function () {wcb()});
                        },
                        function (wcb) {
                            ExamSvc.getUserExams(user._id, function (e, d) {
                                assert(d.length == 0, 'ExamSvc.log error');
                                wcb();
                            });
                        },
                        function (wcb) {
                            db.ExamLog.findOne({'Owner._id': user._id}, function (e, d) {
                                assert(d != null, 'ExamSvc.log log error')
                                wcb()
                            })
                        }
                    ],
                    function (e) {
                        console.log('考试日志 complete');
                        cb();
                    })
            }
        }, function (e) {
            console.log('All Done');
        });
})
