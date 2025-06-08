package com.prova.clinica_veterinaria.repositories;

import java.util.List;

import com.prova.clinica_veterinaria.models.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByIdPet(String idPet);
    List<Agendamento> findByVeterinarioIdFuncionario(Long idVeterinario);
    List<Agendamento> findByStatusAgendamento(Agendamento.StatusAgendamento status);
}