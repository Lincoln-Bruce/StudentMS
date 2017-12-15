package com.travelMS.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.travelMS.dao.StudentMapper;
import com.travelMS.entity.Student;

public class StudentServiceImp  implements StudentService {

	private DataSource dataSource;  
    private JdbcTemplate jdbcTemplateObject;
    
    @Autowired
    StudentMapper studentMapper;
	
    public DataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(DataSource ds) {  
        this.dataSource = ds;  
        this.jdbcTemplateObject = new JdbcTemplate(dataSource);       
    }  
  
    public void addstudent(Student student) {  
        String sql = "INSERT INTO student(ID,name,age,FM)VALUES(seq_studentId.Nextval,?,?,?)";  
          
        jdbcTemplateObject.update(sql, student.getName(),student.getAge(),student.getFM());  
        return ;
    }
    
    public void addStudentByMybatis(Student student){
    	studentMapper.addStudentByMybatis(student);
    }
  
    public void delstudentbyID(String ID) {  
        String sql = "DELETE FROM student WHERE ID=?";  
        jdbcTemplateObject.update(sql,ID);  
        return ;  
    }  
  
    public void delstudentbyname(String name) {  
        String sql = "DELETE FROM student WHERE name=?";  
        jdbcTemplateObject.update(sql,name);  
        return ;          
    }  
  
    public void delallstudent() {  
        String sql = "DELETE FROM student";  
        jdbcTemplateObject.update(sql);  
        return ;      
    }  
  
    public void updstudent(Student student) {  
        String sql = "UPDATE student set name=?,age=?,FM=? WHERE ID=?";  
        jdbcTemplateObject.update(sql,student.getName(),  
                student.getAge(),student.getFM(),student.getID());  
        return ;  
    }  
  
//    public List<Student> allstudent() {  
//        List<Student> students = null;  
//        String sql = "SELECT * FROM student";  
//        students = jdbcTemplateObject.query(sql, new StudentMapper());  
//        return students;  
//    }  
  
//    public List<Student> querystudentbyID(String ID) {  
//        List<Student> students = null;  
//        String sql = "SELECT * FROM student WHERE ID=?";  
//        students = jdbcTemplateObject.query(sql, new Object[]{ID}, new StudentMapper());  
//        return students;  
//    }  
//  
//    public List<Student> querystudentbyname(String name) {  
//        List<Student> students = null;  
//        String sql = "SELECT * FROM student WHERE name=?";  
//        students = jdbcTemplateObject.query(sql, new Object[]{name}, new StudentMapper());  
//        return students;  
//    }  
//  
//    public List<Student> querystudentbyage(int age) {  
//        List<Student> students = null;  
//        String sql = "SELECT * FROM student WHERE age=?";  
//        students = jdbcTemplateObject.query(sql, new Object[]{age}, new StudentMapper());  
//        return students;  
//    }  
    
    public void displayall(){  
        List<Student> students = allstudent();
        for(Student s : students){  
            s.display();
        }  
    }

	public List<Student> allstudent() {
		Map<String, Object> param = new HashMap<String, Object>();
		return studentMapper.getRecords(param);
	}
	
	public int getStudentCount(){
		Map<String, Object> param = new HashMap<String, Object>();
		return studentMapper.getTotal(param);
	}

	public List<Student> querystudentbyID(String ID) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<Student> querystudentbyname(String name) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<Student> querystudentbyage(int age) {
		// TODO Auto-generated method stub
		return null;
	}  

}
