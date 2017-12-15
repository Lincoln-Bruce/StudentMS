package com.travelMS.controller;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.travelMS.entity.Student;
import com.travelMS.service.StudentService;

@Controller
@RequestMapping("/student")
public class StudentController {
	
	private static Logger log = LoggerFactory.getLogger(StudentController.class);

	@Autowired
	private StudentService studentServiceImp;
	
	
	@RequestMapping(value="/save.action")
	public String save(@RequestParam("name") String name, @RequestParam("FM") String FM, @RequestParam("age") int age){
		Student student = new Student();
//		student.setID(new BigDecimal(1));
		student.setName(name);
		student.setAge(age);
		student.setFM(FM);
		studentServiceImp.addStudentByMybatis(student);
		return "success";
	}
	
	@RequestMapping(value="/queryStudents.action")
	@ResponseBody
	public Object queryStudents(@RequestParam Map<String, Object> param){
		List<Student> list = studentServiceImp.allstudent();
		int total = studentServiceImp.getStudentCount();
		
		Map<String, Object> resMap = new HashMap<String, Object>();
		resMap.put("datas", list);
		resMap.put("total", total);
		
		return resMap;
	}
	
	@RequestMapping(value = "/test.action")
	public void main(String [] args){  
//        ApplicationContext context =   
//                new ClassPathXmlApplicationContext("classpath:applicationContext.xml");  
//        StudentDaoImp studentServiceImp = (StudentDaoImp)context.getBean("studentServiceImp");
          
          
        BigDecimal[] ID = { new BigDecimal("2008"), new BigDecimal("2009"), 
        		new BigDecimal("2010"), new BigDecimal("1990"), new BigDecimal("2015"),
        		new BigDecimal("2018") };  
        String[] name = { "Wang", "Hui", "Yu", "Yuan", "Yuan", "Yang"};  
        int[] age = { 16, 18, 20, 20, 22, 21 };  
        String[] FM = {"F", "F", "M", "M", "M", "F"};         
        Student student = null;  
        List<Student> students = null;  
          
        System.out.println("---------addstudent-------------");  
//        for(int i=0; i<ID.length; i++){  
//            student = new Student(ID[i],name[i],age[i],FM[i]);  
//            studentServiceImp.addstudent(student);            
//        }  
        studentServiceImp.displayall();  
          
        System.out.println("---------updatestudent-------------");  
//        student = new Student(new BigDecimal("1990"),"Yuan",18,"M");  
//        studentServiceImp.updstudent(student);  
//        studentServiceImp.displayall();  
          
        System.out.println("---------querystudentbyID-------------");  
        students = studentServiceImp.querystudentbyID("1990");  
        for(Student s : students){  
            s.display();  
        }  
          
        System.out.println("---------querystudentbyname-------------");  
        students = studentServiceImp.querystudentbyname("Yuan");  
        for(Student s : students){  
            s.display();  
        }  
          
        System.out.println("---------querystudentbyage-------------");  
        students = studentServiceImp.querystudentbyage(20);  
        for(Student s : students){  
            s.display();  
        }     
          
        System.out.println("---------delstudentbyage-------------");  
        studentServiceImp.delstudentbyID("2018");  
        studentServiceImp.displayall();  
          
        System.out.println("---------delstudentbyname-------------");  
        studentServiceImp.delstudentbyname("Hui");  
        studentServiceImp.displayall();       
          
        System.out.println("---------delallstudent-------------");  
        studentServiceImp.delallstudent();    
          
    }
	
	@RequestMapping(value = "/doUpload.action", method = RequestMethod.POST)
	public String doUploadFile(@RequestParam("file") MultipartFile file) throws IOException {
		if (!file.isEmpty()) {
			log.info("Process file:{}", file.getOriginalFilename());
		}
		FileUtils.copyInputStreamToFile(file.getInputStream(),
				new File("D:\\", System.currentTimeMillis() + file.getOriginalFilename()));
		return "sucess";
	}
	
}
