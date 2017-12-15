package com.travelMS.entity;

import java.math.BigDecimal;

public class Student {
	private BigDecimal ID;  
    private String name;  
    private int age;  
    private String FM;
    
	public BigDecimal getID() {
		return ID;
	}
	public void setID(BigDecimal iD) {
		ID = iD;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getFM() {
		return FM;
	}
	public void setFM(String fM) {
		FM = fM;
	}
    
	public void display(){  
        System.out.println(ID + " " + name + " " + age + " " + FM);  
    }  
}
