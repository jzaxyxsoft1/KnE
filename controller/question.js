var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
var ExamSvc= require('Svc').ExamSvc;
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'edit':
            res.render('question/edit.ejs',{m:true})
            break;
        case 'examquestions':
            var id = req.query['id']; //ExamDefine  id
            ExamSvc.getExamQuestions(id, function (e,ds){
                res.json(ds);
            })
            break;
        case 'delquestion':
            var id=req.query['id'];
            db.Question.remove({_id:id},function (e){
                res.json({msg:e ==null,error:e})
            });
            break;
    }
}