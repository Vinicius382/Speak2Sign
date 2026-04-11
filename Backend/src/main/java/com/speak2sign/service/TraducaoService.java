package com.speak2sign.service;

import com.speak2sign.model.Favorito;
import com.speak2sign.model.Historico;
import com.speak2sign.model.Usuario;
import com.speak2sign.repository.FavoritoRepository;
import com.speak2sign.repository.HistoricoRepository;
import com.speak2sign.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TraducaoService {

    private final HistoricoRepository historicoRepository;
    private final FavoritoRepository favoritoRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public TraducaoService(
            HistoricoRepository historicoRepository,
            FavoritoRepository favoritoRepository,
            UsuarioRepository usuarioRepository) {
        this.historicoRepository = historicoRepository;
        this.favoritoRepository = favoritoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Usuario buscarUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    //HISTÓRICO 

    public List<Historico> listarHistorico(Long usuarioId) {
        return historicoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
    }

    public Historico adicionarAoHistorico(Long usuarioId, String tipo, String texto) {
        Usuario usuario = buscarUsuario(usuarioId);

        Historico historico = new Historico();
        historico.setUsuario(usuario);
        historico.setTipo(tipo);
        historico.setTexto(texto);

        return historicoRepository.save(historico);
    }

    public void removerDoHistorico(Long usuarioId, Long itemId) {
        historicoRepository.deleteByIdAndUsuarioId(itemId, usuarioId);
    }

    public void limparHistorico(Long usuarioId) {
        historicoRepository.deleteByUsuarioId(usuarioId);
    }

    //FAVORITOS 

    public List<Favorito> listarFavoritos(Long usuarioId) {
        return favoritoRepository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
    }

    public Favorito adicionarFavorito(Long usuarioId, String tipo, String texto) {
        Usuario usuario = buscarUsuario(usuarioId);

        Optional<Favorito> existente = favoritoRepository.findByUsuarioIdAndTexto(usuarioId, texto);
        if (existente.isPresent()) {
            return existente.get();
        }

        Favorito favorito = new Favorito();
        favorito.setUsuario(usuario);
        favorito.setTipo(tipo);
        favorito.setTexto(texto);

        return favoritoRepository.save(favorito);
    }

    public void removerFavorito(Long usuarioId, Long itemId) {
        favoritoRepository.deleteByIdAndUsuarioId(itemId, usuarioId);
    }
}
