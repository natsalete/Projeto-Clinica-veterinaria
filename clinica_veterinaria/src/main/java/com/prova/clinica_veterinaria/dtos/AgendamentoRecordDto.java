package com.prova.clinica_veterinaria.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.prova.clinica_veterinaria.models.Agendamento.TipoServico;
import com.prova.clinica_veterinaria.models.Agendamento.StatusAgendamento;

public record AgendamentoRecordDto(
    String idPet,
    LocalDateTime dataAgendamento,
    TipoServico tipoServico,
    StatusAgendamento statusAgendamento,
    String observacoes,
    BigDecimal valorEstimado,
    Long idVeterinario
) {}
