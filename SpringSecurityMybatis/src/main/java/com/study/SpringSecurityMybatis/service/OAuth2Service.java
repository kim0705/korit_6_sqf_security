package com.study.SpringSecurityMybatis.service;

import com.study.SpringSecurityMybatis.dto.request.ReqOAuth2MergeDto;
import com.study.SpringSecurityMybatis.repository.OAuth2UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class OAuth2Service implements OAuth2UserService {

    @Autowired
    private DefaultOAuth2UserService defaultOAuth2UserService;

    @Autowired
    private OAuth2UserMapper oAuth2UserMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = defaultOAuth2UserService.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        Map<String, Object> oauth2Attributes = new HashMap<>();
        oauth2Attributes.put("provider", userRequest.getClientRegistration().getClientName());

        switch (userRequest.getClientRegistration().getClientName()) {
            case "Google":
                oauth2Attributes.put("id", attributes.get("sub").toString());
                break;
            case "Naver":
                attributes = (Map<String, Object>) attributes.get("response");
                oauth2Attributes.put("id", attributes.get("id").toString());
                break;
            case "Kakao":
        }

        return new DefaultOAuth2User(new HashSet<>(), oauth2Attributes, "id"); // 해당 nameKey를 가져올 수 있음
    }

    public void merge(com.study.SpringSecurityMybatis.entity.OAuth2User oAuth2User) {
        oAuth2UserMapper.save(oAuth2User);
    }

}
