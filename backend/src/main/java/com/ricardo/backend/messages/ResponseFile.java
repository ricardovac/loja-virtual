package com.ricardo.backend.messages;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseFile {
    private String nome;
    private String url;
    private String type;
    private long size;
}
