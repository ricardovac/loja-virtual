package com.ricardo.backend.service;

import com.ricardo.backend.dto.PessoaClienteRequestDTO;
import com.ricardo.backend.entity.Pessoa;
import com.ricardo.backend.repository.PessoaClienteRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PessoaClienteService {
    @Autowired
    private PessoaClienteRepository pessoaClienteRepository;

    @Autowired
    private PermissaoPessoaService permissaoPessoaService;

    @Autowired
    private EmailService emailService;

    public Pessoa registrar(PessoaClienteRequestDTO pessoaClienteRequestDTO) throws MessagingException {
        Pessoa pessoa = new PessoaClienteRequestDTO().converter(pessoaClienteRequestDTO);
        pessoa.setDataCriacao(new Date());
        Pessoa pessoaNova = pessoaClienteRepository.saveAndFlush(pessoa);
        permissaoPessoaService.vincularPessoaPermissaoCliente(pessoaNova);
        emailService.enviarEmailComAnexo(
                pessoaNova.getEmail(),
                "Cadastro na Loja virtual",
                "O registro na loja foi efetuado com sucesso. " +
                        "Em breve você receberá a senha de acesso por e-mail.");
        return pessoaNova;
    }
}
