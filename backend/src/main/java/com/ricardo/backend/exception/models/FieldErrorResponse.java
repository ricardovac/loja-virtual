package com.ricardo.backend.exception.models;

import java.util.List;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class FieldErrorResponse {
    private List<CustomFieldError> Erros;
}
