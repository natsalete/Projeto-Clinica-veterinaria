package com.prova.clinica_veterinaria.models;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

@Entity
@Table(name = "agendamentos")
public class Agendamento implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_agendamento")
    private Long idAgendamento;
    
    // ID do pet no serviço Python/MongoDB (não é FK aqui)
    @Column(name = "id_pet", nullable = false)
    private String idPet;
    
    @Column(name = "data_agendamento", nullable = false)
    private LocalDateTime dataAgendamento;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_servico", nullable = false)
    private TipoServico tipoServico;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status_agendamento", nullable = false)
    private StatusAgendamento statusAgendamento = StatusAgendamento.AGENDADO;
    
    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;
    
    @Column(name = "valor_estimado", precision = 10, scale = 2)
    private BigDecimal valorEstimado;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_veterinario", nullable = false)
    private Funcionario veterinario;
    
    // Enums
    public enum TipoServico {
        CONSULTA, CIRURGIA, VACINACAO, EXAME, BANHO_TOSA
    }
    
    public enum StatusAgendamento {
        AGENDADO, CONFIRMADO, REALIZADO, CANCELADO
    }
    
    // Getters e Setters
    public Long getIdAgendamento() {
        return idAgendamento;
    }
    
    public void setIdAgendamento(Long idAgendamento) {
        this.idAgendamento = idAgendamento;
    }
    
    public String getIdPet() {
        return idPet;
    }
    
    public void setIdPet(String idPet) {
        this.idPet = idPet;
    }
    
    public LocalDateTime getDataAgendamento() {
        return dataAgendamento;
    }
    
    public void setDataAgendamento(LocalDateTime dataAgendamento) {
        this.dataAgendamento = dataAgendamento;
    }
    
    public TipoServico getTipoServico() {
        return tipoServico;
    }
    
    public void setTipoServico(TipoServico tipoServico) {
        this.tipoServico = tipoServico;
    }
    
    public StatusAgendamento getStatusAgendamento() {
        return statusAgendamento;
    }
    
    public void setStatusAgendamento(StatusAgendamento statusAgendamento) {
        this.statusAgendamento = statusAgendamento;
    }
    
    public String getObservacoes() {
        return observacoes;
    }
    
    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }
    
    public BigDecimal getValorEstimado() {
        return valorEstimado;
    }
    
    public void setValorEstimado(BigDecimal valorEstimado) {
        this.valorEstimado = valorEstimado;
    }
    
    public Funcionario getVeterinario() {
        return veterinario;
    }
    
    public void setVeterinario(Funcionario veterinario) {
        this.veterinario = veterinario;
    }
    
}