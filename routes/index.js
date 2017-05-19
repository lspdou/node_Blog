var express = require('express');
var router = express.Router();
var mongodb=require('mongodb').MongoClient;
//数据库地址
var db_str='mongodb://localhost:27017/picture'
/* GET home page. */
router.get('/', function(req, res, next) {
  //链接数据库 
	mongodb.connect(db_str,function(err,db) {
			if(err){
				console.log(err);
			}else{
				//调用finddata函数
				finddata(db)
				//关闭数据库
				db.close()
			}
	})
	//查找函数
	var finddata=function(db) {
				//找到要查找的集合
				var coll=db.collection('news')
				var coll1=db.collection('message')
				var bian=0
				coll1.find({}).toArray(function(err,litem1) {
						if(!err){
							bian=litem1
						}
				})
				
				coll.find({}).toArray(function(err,litem) {
						if(!err){
							res.render('index', {user:req.session.user,litem:litem,bian:bian,tip:''});
						}
				})
				
	}
});

router.post('/', function(req, res, next) {
			
			//获取留言数据
			var tit=req.body['tit']
			var con=req.body['con']
			if (req.session.user) {
				//链接数据库 
				mongodb.connect(db_str,function(err,db) {
						if(err){
							console.log(err);
						}else{
							//调用插入函数
							insertdata(db,function(result) {
									res.redirect('/');
									db.close()
							})
							
						}
				})
			}else{
				//链接数据库 
				mongodb.connect(db_str,function(err,db) {
						if(err){
							console.log(err);
						}else{
							//调用finddata函数
							finddata(db)
							//关闭数据库
							db.close()
						}
				})
				//查找函数
				var finddata=function(db) {
							//找到要查找的集合
							var coll=db.collection('news')
							var coll1=db.collection('message')
							var bian=0
							coll1.find({}).toArray(function(err,litem1) {
									if(!err){
										bian=litem1
									}
							})
							
							coll.find({}).toArray(function(err,litem) {
									if(!err){
										res.render('index',{user:req.session.user,litem:litem,bian:bian,tip:'<div class="form-tips">请先登录在留言</div>'});
									}
							})
				}
			}
			
			//插入函数
			var insertdata=function(db,callback) {
						//找到要插入的集合
						var coll=db.collection('message')
						//设置需要插入集合的文档数据
						var data=[{tit:tit,con:con}]
						coll.insert(data,function(err,result) {
								if(err){
									console.log(err)
								}else{
									callback(result)
								}
						})
			}
});

router.get('/register', function(req, res, next) {
  res.render("register",{num:""})
});

router.get('/showlist', function(req, res, next) {
  		
  		
			//链接数据库 
			mongodb.connect(db_str,function(err,db) {
					if(err){
						console.log(err);
					}else{
						//调用finddata函数
						finddata(db)
						//关闭数据库
						db.close()
					}
			})
			//查找函数
			var finddata=function(db) {
						//找到要查找的集合
						var coll=db.collection('news')
						//设置需要查找集合的文档数据
						var ooo=req.query.id
					
						coll.find({}).toArray(function(err,litem) {
								if(!err){
									litem.forEach(function(cen,index) {
										if(cen["_id"]==req.query.id){
											res.render("showlist",{con:cen["con"],tit:cen["tit"],user:req.session.user})
										}
									})
								}
						})
			}
});


module.exports = router;
