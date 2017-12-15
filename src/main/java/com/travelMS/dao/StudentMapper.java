package com.travelMS.dao;

import java.util.List;
import java.util.Map;

import com.travelMS.entity.Student;

public interface StudentMapper {
	
	void addStudentByMybatis(Student student);
	
	List<Student> getRecords(Map<String, Object> param);
	
	int getTotal(Map<String, Object> param);
}
