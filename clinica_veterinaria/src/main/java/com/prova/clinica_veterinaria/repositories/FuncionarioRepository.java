package com.prova.clinica_veterinaria.repositories;

import com.prova.clinica_veterinaria.models.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
    
}
