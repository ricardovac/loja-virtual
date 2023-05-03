package com.ricardo.backend.repository;

import com.ricardo.backend.entity.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
    public Marca findByNome(String nome);
}
