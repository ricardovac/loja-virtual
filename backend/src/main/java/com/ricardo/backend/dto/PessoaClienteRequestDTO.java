package com.ricardo.backend.dto;

import com.ricardo.backend.entity.Pessoa;
import jakarta.validation.constraints.Email;
import lombok.Data;
import org.springframework.beans.BeanUtils;

@Data
public class PessoaClienteRequestDTO {
    private String nome;
    private String cpf;
    @Email
    private String email;
    private String endereco;
    private String cep;
    private String cidade;

    public Pessoa converter(PessoaClienteRequestDTO pessoaClienteRequestDTO) {
        Pessoa pessoa = new Pessoa();
        BeanUtils.copyProperties(pessoaClienteRequestDTO, pessoa);
        return pessoa;
    }
}
