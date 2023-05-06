package com.ricardo.backend.controller;

import java.util.HashMap;

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
import com.ricardo.backend.security.JwtUtil;
import com.ricardo.backend.service.PessoaGerenciamentoService;

@RestController
@RequestMapping("/api/pessoa-gerenciamento")
@CrossOrigin
public class PessoaGerenciamentoController {
    @Autowired
    private PessoaGerenciamentoService pessoaGerenciamentoService;

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
            HashMap<String, Object> map = new HashMap<>();
            map.put("token", token);
            map.put("permissoes", autenticado.getAuthorities());
            return ResponseEntity.ok(map);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário inexistente ou senha inválida");
        }
    }
}
