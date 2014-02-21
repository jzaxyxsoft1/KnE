/**
 * Created by wdg on 14-2-20.
 */
var db = require('DB').DB;
var async = require('async');
var _ = require('underscore');
var ExamSvc=require('Svc').ExamSvc;
exports.get = function (req, res) {
    var t = req.query['t'].toLowerCase();
    switch (t) {
        case 'p': //pad page
            res.render('exam/p.ejs', {u: req.currentUser });
            break;
        case 'define': //考试定义
            res.render('exam/define.ejs',{m:true});
            break;
        case 'userexams':
           ExamSvc.getUserExams(req.currentUser._id, function (e,ds){
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
            ExamSvc.log(req.currentUser,obj.ExamID,obj.Reault,function(e){
                res.json({msg:e ==null,error:e});
            })

            break;
    }
}