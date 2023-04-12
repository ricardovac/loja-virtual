package com.ricardo.backend.service;

import com.ricardo.backend.entity.Permissao;
import com.ricardo.backend.repository.PermissaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PermissaoService {
    @Autowired
    private PermissaoRepository permissaoRepository;

    public List<Permissao> listarTodosPermissao() {
        return permissaoRepository.findAll();
    }

    public Permissao inserirPermissao(Permissao permissao) {
        permissao.setDataCriacao(new Date());
        return permissaoRepository.saveAndFlush(permissao);
    }

    public Permissao alterarPermissao(Permissao permissao) {
        Optional<Permissao> permissaoExistente = permissaoRepository.findById(permissao.getId());
        if (permissaoExistente.isPresent()) {
            permissao.setDataCriacao(permissaoExistente.get().getDataCriacao()); // Mantém a data de criação existente
        } else {
            permissao.setDataCriacao(new Date()); // Define uma nova data de criação
        }
        permissao.setDataAtualizacao(new Date()); // Define a nova data de atualização
        return permissaoRepository.saveAndFlush(permissao);
    }

    public void excluirPermissao(Long id) {
        Optional<Permissao> permissaoOpcional = permissaoRepository.findById(id);
        permissaoOpcional.ifPresent(p -> permissaoRepository.delete(p));
    }
}
