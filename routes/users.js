var express = require('express');
var router = express.Router();
//mongo服务
var mongodb=require('mongodb').MongoClient;
//数据库地址
var db_str='mongodb://localhost:27017/picture'

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('register', {num:""});
});

router.get('/login', function(req, res, next) {
  res.render('login', {num:''});
});

router.get('/quit', function(req, res, next) {
  req.session.user=undefined
	res.redirect('/')
});

//router.get('/liuyan', function(req, res, next) {
//		//链接数据库 
//			mongodb.connect(db_str,function(err,db) {
//					if(err){
//						console.log(err);
//					}else{
//						//调用finddata函数
//						finddata(db)
//						//关闭数据库
//						db.close()
//					}
//			})
//			//查找函数
//			var finddata=function(db) {
//						//找到要查找的集合
//						var coll=db.collection('message')
//						coll.find({}).toArray(function(err,litem) {
//								if(!err){
//										res.render('showlist', {litem:litem});
//								}
//						})
//			}
//});



//注册
router.post('/register', function(req, res, next) {
			//获取表单数据
			var user=req.body['user']
			var pass=req.body['pwd']
			//链接数据库 
			mongodb.connect(db_str,function(err,db) {
					if(err){
						console.log(err);
					}else{
						//调用插入函数
						if(user&&pass){
							insertdata(db,function(result) {
									res.redirect('/users/login');
									db.close()
							})
						}else{
									res.redirect('/register');
									db.close()
						}
					}
			})
			//插入函数
			var insertdata=function(db,callback) {
						//找到要插入的集合
						var coll=db.collection('login')
						//设置需要插入集合的文档数据
						var data=[{user:user,pass:pass}]
						coll.insert(data,function(err,result) {
								if(err){
									console.log(err)
								}else{
									callback(result)
								}
						})
			}
});

//登录
router.post('/login', function(req, res, next) {
			//获取表单数据
			var user=req.body['user']
			var pass=req.body['pwd']
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
						var coll=db.collection('login')
						//设置需要查找集合的文档数据
						var data={user:user,pass:pass}
						coll.find(data).toArray(function(err,litem) {
								if(!err){
										if (litem.length) {
											req.session.user=litem[0].user
											res.redirect('/');
										}else{
											res.render('login', {num:'<div class="form-tips">请输入正确的用户名和密码</div>',});
										}
								}
						})
			}
});

//留言
//router.post('/liuyan', function(req, res, next) {
//			
//			//获取留言数据
//			var tit=req.body['tit']
//			var con=req.body['con']
//			if (req.session.user) {
//				//链接数据库 
//				mongodb.connect(db_str,function(err,db) {
//						if(err){
//							console.log(err);
//						}else{
//							//调用插入函数
//							insertdata(db,function(result) {
//									res.redirect('/users/liuyan');
//									db.close()
//							})
//							
//						}
//				})
//			}else{
//				res.send('失败！！！！！！');
//			}
//			
//			//插入函数
//			var insertdata=function(db,callback) {
//						//找到要插入的集合
//						var coll=db.collection('message')
//						//设置需要插入集合的文档数据
//						var data=[{tit:tit,con:con}]
//						coll.insert(data,function(err,result) {
//								if(err){
//									console.log(err)
//								}else{
//									callback(result)
//								}
//						})
//			}
//});

module.exports = router;
