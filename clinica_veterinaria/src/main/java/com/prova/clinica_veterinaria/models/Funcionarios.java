package com.prova.clinica_veterinaria.models;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "funcionarios")
public class Funcionarios implements Serializable {

    private static final long serialVersionUID = 1L;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    /*id_funcionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    cargo ENUM('VETERINARIO', 'AUXILIAR', 'RECEPCIONISTA', 'GERENTE') NOT NULL,
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT TRUE*/
}
