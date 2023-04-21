package com.ricardo.backend.service;

import com.ricardo.backend.entity.Estado;
import com.ricardo.backend.repository.EstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class EstadoService {
    @Autowired
    private EstadoRepository estadoRepository;

    public List<Estado> listarTodosEstados() {
        return estadoRepository.findAll();
    }

    public Estado inserirEstado(Estado estado) {
        estado.setDataCriacao(new Date());
        return estadoRepository.saveAndFlush(estado);
    }

    public Estado alterarEstado(Estado estado) {
        Optional<Estado> estadoExistente = estadoRepository.findById(estado.getId());
        if (estadoExistente.isPresent()) {
            estado.setDataCriacao(estadoExistente.get().getDataCriacao()); // Mantém a data de criação existente
        } else {
            estado.setDataCriacao(new Date()); // Define uma nova data de criação
        }
        estado.setDataAtualizacao(new Date()); // Define a nova data de atualização
        return estadoRepository.saveAndFlush(estado);
    }

    public void excluirEstado(Long id) {
        Optional<Estado> estadoOptional = estadoRepository.findById(id);
        estadoOptional.ifPresent(estado -> estadoRepository.delete(estado));
    }
}
