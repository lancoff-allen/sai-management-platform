package com.sai.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 配置类
 * 解决 Swagger UI "Unable to render this definition" 错误
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .openapi("3.0.1")  // 明确指定 OpenAPI 版本
                .info(new Info()
                        .title("SAI Management Platform API")
                        .description("SAI 管理平台后端 API 文档")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SAI Team")
                                .email("support@sai.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080/api")
                                .description("开发环境")
                ));
    }
}