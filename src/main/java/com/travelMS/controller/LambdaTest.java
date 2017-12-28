package com.travelMS.controller;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;


public class LambdaTest {

	public static void main(String[] args) {

		String[] atp = {"Rafael Nadal", "Novak Djokovic",  
			       "Stanislas Wawrinka",  
			       "David Ferrer","Roger Federer",  
			       "Andy Murray","Tomas Berdych",  
			       "Juan Martin Del Potro"};  
			List<String> players =  Arrays.asList(atp);  
			  
			// 以前的循环方式  
//			for (String player : players) {  
//			     System.out.print(player + "; ");  
//			}  
			  
			// 使用 lambda 表达式以及函数操作(functional operation)  
			players.forEach((player) -> System.out.println(player + "; ")); 
			
			Arrays.sort(atp, (String sort1, String sort2) -> (sort1.compareTo(sort2)));
			
			players.forEach((player) -> System.out.println(player + "; ")); 
//			Comparator<String> sortByName = (String s1, String s2) -> (s1.compareTo(s2));  
//			Arrays.sort(atp, sortByName); 

	}

}
