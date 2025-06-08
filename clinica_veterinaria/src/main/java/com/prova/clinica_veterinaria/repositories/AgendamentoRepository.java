package com.prova.clinica_veterinaria.repositories;

import com.prova.clinica_veterinaria.models.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
}
