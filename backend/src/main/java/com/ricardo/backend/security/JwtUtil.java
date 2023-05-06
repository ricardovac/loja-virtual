package com.ricardo.backend.security;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ricardo.backend.entity.Pessoa;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String chaveSecreta;
    @Value("${jwt.expiration}")
    private int validadeToken;
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    public String gerarTokenUsername(Pessoa pessoa) {
        return Jwts.builder().setSubject(pessoa.getUsername()).setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + validadeToken))
                .signWith(SignatureAlgorithm.HS512, chaveSecreta).compact();
    }

    public String getEmailToken(String token) {
        return Jwts.parser().setSigningKey(chaveSecreta).parseClaimsJws(token).getBody().getSubject(); // Subject =
                                                                                                       // email
    }

    public boolean validarToken(String token, HttpServletRequest request) {
        try {
            Jwts.parser().setSigningKey(chaveSecreta).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            logger.error("Assinatura Inválida", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Token expirado", e.getMessage());
            request.setAttribute("validacaoToken", "Token expirado");
        } catch (UnsupportedJwtException e) {
            logger.error("Token não suportado", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Token não encontrado", e.getMessage());
        }
        return false;
    }
}