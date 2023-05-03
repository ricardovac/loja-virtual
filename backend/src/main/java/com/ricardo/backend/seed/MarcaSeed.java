package com.ricardo.backend.seed;


import com.ricardo.backend.entity.Marca;
import com.ricardo.backend.repository.MarcaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class MarcaSeed implements CommandLineRunner {

    private final List<String> marcaNomes = Arrays.asList(
            "Apple",
            "Samsung",
            "Sony",
            "LG",
            "Microsoft",
            "Lenovo",
            "Dell",
            "HP",
            "Nike",
            "Adidas",
            "Puma",
            "Gucci",
            "Prada",
            "Chanel",
            "H&M",
            "Zara",
            "Levi's",
            "Calvin Klein"
    );

    @Autowired
    private MarcaRepository marcaRepository;

    @Override
    public void run(String... args) {
        for (String nome : marcaNomes) {
            Marca marca = marcaRepository.findByNome(nome);
            if (marca == null) {
                marca = new Marca();
                marca.setNome(nome);
                marcaRepository.save(marca);
            }
        }
    }
}
