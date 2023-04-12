package com.ricardo.backend.service;

import com.ricardo.backend.entity.Cidade;
import com.ricardo.backend.repository.CidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CidadeService {

    @Autowired
    private CidadeRepository cidadeRepository;

    public List<Cidade> listarTodosEstados() {
        return cidadeRepository.findAll();
    }

    public Cidade inserirCidade(Cidade cidade) {
        cidade.setDataCriacao(new Date());
        return cidadeRepository.saveAndFlush(cidade);
    }

    public Cidade alterarCidade(Cidade cidade) {
        cidade.setDataAtualizacao(new Date());
        return cidadeRepository.saveAndFlush(cidade);
    }

    public void excluirCidade(Long id) {
        Optional<Cidade> cidadeOptional = cidadeRepository.findById(id);
        cidadeOptional.ifPresent(estado -> cidadeRepository.delete(estado));
    }
}
