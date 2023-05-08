package com.ricardo.backend.exception.models;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class CustomFieldError {
    private String campo;
    private String mensagem;
}
