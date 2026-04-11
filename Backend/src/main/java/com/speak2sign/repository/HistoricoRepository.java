package com.speak2sign.repository;

import com.speak2sign.model.Historico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {

    List<Historico> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    @Transactional
    void deleteByIdAndUsuarioId(Long id, Long usuarioId);

    @Transactional
    void deleteByUsuarioId(Long usuarioId);
}
