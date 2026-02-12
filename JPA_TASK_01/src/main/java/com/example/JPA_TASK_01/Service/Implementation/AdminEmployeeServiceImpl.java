package com.example.JPA_TASK_01.Service.Implementation;

import com.example.JPA_TASK_01.Entity.User;
import com.example.JPA_TASK_01.Repo.UserRepository;
import com.example.JPA_TASK_01.Service.AdminEmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminEmployeeServiceImpl implements AdminEmployeeService {

    private final UserRepository userRepository;

    public AdminEmployeeServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<User> getAllEmployeesForAdmin() {
        return userRepository.findAll();
    }


}

