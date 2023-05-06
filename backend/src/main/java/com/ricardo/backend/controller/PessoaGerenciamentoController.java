package com.ricardo.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ricardo.backend.entity.Pessoa;
import com.ricardo.backend.exception.TokenRefreshException;
import com.ricardo.backend.security.JwtUtil;
import com.ricardo.backend.security.model.JwtResponse;
import com.ricardo.backend.security.model.RefreshToken;
import com.ricardo.backend.security.model.TokenRefreshRequest;
import com.ricardo.backend.security.model.TokenRefreshResponse;
import com.ricardo.backend.security.service.RefreshTokenService;
import com.ricardo.backend.service.PessoaGerenciamentoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pessoa-gerenciamento")
@CrossOrigin
public class PessoaGerenciamentoController {
    @Autowired
    private PessoaGerenciamentoService pessoaGerenciamentoService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/senha-codigo")
    public String recuperarCodigo(@RequestBody Pessoa pessoa) {
        return pessoaGerenciamentoService.solicitarCodigo(pessoa.getEmail());
    }

    @PostMapping("/senha-alterar")
    public String alterarSenha(@RequestBody Pessoa pessoa) {
        return pessoaGerenciamentoService.alterarSenha(pessoa);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Pessoa pessoa) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(pessoa.getEmail(), pessoa.getSenha()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Pessoa autenticado = (Pessoa) authentication.getPrincipal();
            String token = jwtUtil.gerarTokenUsername(autenticado); // Gerar token para o usuario autenticado
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(autenticado.getId());

            return ResponseEntity
                    .ok(new JwtResponse(token, "Bearer", refreshToken.getToken(), autenticado.getId(),
                            autenticado.getNome(),
                            autenticado.getUsername(), autenticado.getAuthorities()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário inexistente ou senha inválida");
        }
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getPessoa)
                .map(pessoa -> {
                    String token = jwtUtil.gerarTokenUsername(pessoa);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken, "Bearer"));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }
}
