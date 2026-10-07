package com.opd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web Configuration — Global CORS settings.
 * 
 * CORS (Cross-Origin Resource Sharing) is needed because:
 * - Backend runs on localhost:8080
 * - Frontend (Angular) runs on localhost:4200
 * - Browsers block cross-origin requests by default for security
 * 
 * Using allowedOriginPatterns("*") allows local development from any client port
 * while supporting allowCredentials(true).
 */
@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                    .addMapping("/api/**")
                    .allowedOriginPatterns("http://localhost:[*]", "http://127.0.0.1:[*]")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
