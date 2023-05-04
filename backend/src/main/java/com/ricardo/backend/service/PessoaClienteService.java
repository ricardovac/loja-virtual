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
        Pessoa objetoNovo = pessoaClienteRepository.saveAndFlush(pessoa);
        permissaoPessoaService.vincularPessoaPermissaoCliente(objetoNovo);
        emailService.enviarEmailTexto(objetoNovo.getEmail(), objetoNovo.getNome(),
                "O registro na loja foi realizado com sucesso. Em breve você receberá a senha de acesso por e-mail!!");
        return objetoNovo;
    }
}
