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
        Optional<Cidade> cidadeExistente = cidadeRepository.findById(cidade.getId());
        if (cidadeExistente.isPresent()) {
            cidade.setDataCriacao(cidadeExistente.get().getDataCriacao()); // Mantém a data de criação existente
        } else {
            cidade.setDataCriacao(new Date()); // Define uma nova data de criação
        }
        cidade.setDataAtualizacao(new Date()); // Define a nova data de atualização
        return cidadeRepository.saveAndFlush(cidade);
    }

    public void excluirCidade(Long id) {
        Optional<Cidade> cidadeOptional = cidadeRepository.findById(id);
        cidadeOptional.ifPresent(estado -> cidadeRepository.delete(estado));
    }
}
