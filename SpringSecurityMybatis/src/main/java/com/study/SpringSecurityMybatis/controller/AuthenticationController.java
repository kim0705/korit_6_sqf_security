package com.study.SpringSecurityMybatis.controller;

import com.study.SpringSecurityMybatis.dto.request.ReqSignupDto;
import com.study.SpringSecurityMybatis.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody ReqSignupDto dto, BindingResult bindingResult) {

        if(!dto.getPassword().equals(dto.getCheckPassword())) {
            FieldError fieldError
                    = new FieldError("checkPassword", "checkPassword", "비밀번호가 일치하지 않습니다.");
            bindingResult.addError(fieldError);
        }

        if(userService.isDuplicateUsername(dto.getUsername())) {
            FieldError fieldError
                    = new FieldError("username", "username", "이미 존재하는 사용자이름입니다.");
            bindingResult.addError(fieldError);
        }

        if(bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getFieldErrors());
        }

        return ResponseEntity.ok().body(userService.insertUserAndUserRoles(dto));
    }

}










