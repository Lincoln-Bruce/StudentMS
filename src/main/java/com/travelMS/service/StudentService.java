package com.travelMS.service;

import java.util.List;

import javax.sql.DataSource;

import com.travelMS.entity.Student;

public interface StudentService {

	 public void setDataSource(DataSource ds);     
     
     public void addstudent(Student student);  
     
     void addStudentByMybatis(Student student);
      
     public void delstudentbyID(String ID);  
      
     public void delstudentbyname(String name);  
      
     public void delallstudent();  
       
     public void updstudent(Student student);  
      
     public List<Student> allstudent();  

     int getStudentCount();
      
     public List<Student> querystudentbyID(String ID);  
      
     public List<Student> querystudentbyname(String name);  
       
     public List<Student> querystudentbyage(int age);
     
     public void displayall();
}
