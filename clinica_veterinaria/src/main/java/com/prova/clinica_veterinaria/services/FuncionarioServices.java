package com.prova.clinica_veterinaria.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.prova.clinica_veterinaria.repositories.FuncionarioRepository;
import com.prova.clinica_veterinaria.models.Funcionario;

@Service
public class FuncionarioServices {
    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioServices(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public List<Funcionario> getFuncionarios() {
        return funcionarioRepository.findAll();
    }

    public Funcionario salvarFuncionario(Funcionario funcionario) {
        return funcionarioRepository.save(funcionario);
    }

    public void excluirFuncionario(Funcionario funcionario) {
        funcionarioRepository.deleteById(funcionario.getIdFuncionario());
    }

    public Optional<Funcionario> buscarFuncionarioPorId(Long id) {
        return funcionarioRepository.findById(id);
    }

    public Funcionario atualizarFuncionario(Long id, Funcionario funcionarioAtualizado) {
        Optional<Funcionario> funcionarioExistente = funcionarioRepository.findById(id);
        
        if (funcionarioExistente.isPresent()) {
            Funcionario funcionario = funcionarioExistente.get();
            
            // Atualiza os campos do funcionário existente com os dados recebidos
            if (funcionarioAtualizado.getNome() != null) {
                funcionario.setNome(funcionarioAtualizado.getNome());
            }
            if (funcionarioAtualizado.getCargo() != null) {
                funcionario.setCargo(funcionarioAtualizado.getCargo());
            }
            if (funcionarioAtualizado.getTelefone() != null) {
                funcionario.setTelefone(funcionarioAtualizado.getTelefone());
            }
            if (funcionarioAtualizado.getAtivo() != null) {
                funcionario.setAtivo(funcionarioAtualizado.getAtivo());
            }
            // Adicione outros campos conforme necessário
            
            return funcionarioRepository.save(funcionario);
        } else {
            throw new RuntimeException("Funcionário não encontrado com ID: " + id);
        }
    }
}