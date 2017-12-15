<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
// response.sendRedirect("default.action");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <script type="text/javascript">
    	var vp = null;
    </script>
    
	<script type="text/javascript" src="jquery/jquery-1.8.3.min.js"></script>
	
<!--     <script src="http://cdn.bootcss.com/extjs/3.4.1-1/adapter/ext/ext-base.js"></script> -->
<!--  	<script src="http://cdn.bootcss.com/extjs/3.4.1-1/ext-all-debug.js"></script> -->
<!-- 	<link href="http://cdn.bootcss.com/extjs/3.4.1-1/resources/css/ext-all.css" rel="stylesheet"/> -->
    
    
    <script type=" text/javascript " src="/ext/ext-all.js "></script>
	<script type="text/javascript" src="../ext/locale/ext-lang-zh_CN.js"></script>
<!-- 	<script type="text/javascript" src="ext/ext-all-debug.js"></script> -->
	<link rel=" stylesheet " type=" text/css " href=" /ext/resources/css/ext-all.css " />
	<script type=" text/javascript " src= "/js/default.js "></script>
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	
	<script type="text/javascript">
		Ext.onReady(function() {
	
			Ext.tip.QuickTipManager.init();
	
			vp = new Ext.Viewport({
				layout : "border",
				items : [ examplePanel ]
			});
			store.load();
		})
	</script>
  </head>
  
  <body>
<!--   	<div><h2><img src="images/headerFontABS.png"></h2></div> -->
<!--     <form action="/student/save.action" method="post"> -->
<!--           <input type="file" name="file"/> --> 
<!-- 			姓名<input type="text" name="name"/> -->
<!-- 			年龄<input type="text" name="age"/> -->
<!-- 			<input type="radio" name="FM" value="M">男 -->
<!--     		<input type="radio" name="FM" value="F">女 -->
<!--     		<input type="submit" value="保存"/> -->
    </form>
  </body>
</html>
