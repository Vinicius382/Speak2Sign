package com.speak2sign.repository;

import com.speak2sign.model.Favorito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);

    Optional<Favorito> findByUsuarioIdAndTexto(Long usuarioId, String texto);

    @Transactional
    void deleteByIdAndUsuarioId(Long id, Long usuarioId);
}
