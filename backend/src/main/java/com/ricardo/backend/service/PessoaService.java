package com.ricardo.backend.service;

import com.ricardo.backend.entity.Pessoa;
import com.ricardo.backend.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PessoaService {
    @Autowired
    private PessoaRepository pessoaRepository;

    public List<Pessoa> listarTodosPermissao() {
        return pessoaRepository.findAll();
    }

    public Pessoa inserirPermissao(Pessoa pessoa) {
        pessoa.setDataCriacao(new Date());
        return pessoaRepository.saveAndFlush(pessoa);
    }

    public Pessoa alterarPermissao(Pessoa pessoa) {
        pessoa.setDataAtualizacao(new Date());
        return pessoaRepository.saveAndFlush(pessoa);
    }

    public void excluirPermissao(Long id) {
        Optional<Pessoa> pessoaOpcional = pessoaRepository.findById(id);
        pessoaOpcional.ifPresent(p -> pessoaRepository.delete(p));
    }
}
