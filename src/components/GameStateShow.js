import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GameStateShow = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [gameState, setGameState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Estado para controlar o 'Play/Pause'
  const [intervalSpeed, setIntervalSpeed] = useState(500); // Intervalo (ms) entre gerações
  const intervalRef = useRef(null); // Para armazenar o ID do setInterval
  const navigate = useNavigate();

  // Busca inicial do GameState
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar o game state");
        const data = await response.json();
        setGameState(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchGameState();
    }
  }, [id, token]);

  // Função para carregar a próxima geração (a mesma que você já tem)
  const handleNextGeneration = async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}/next_generation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao avançar para a próxima geração");
      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Função para resetar o jogo (a mesma que você já tem)
  const handleResetGame = async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}/reset_to_initial`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao resetar o jogo");
      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Efeito para iniciar/limpar o setInterval quando isPlaying mudar
  useEffect(() => {
    if (isPlaying) {
      // Inicia o setInterval
      intervalRef.current = setInterval(() => {
        handleNextGeneration();
      }, intervalSpeed);
    } else {
      // Se parar de tocar, limpa o intervalo
      clearInterval(intervalRef.current);
    }

    // Limpa o intervalo ao sair do componente para evitar memory leaks
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, intervalSpeed]);

  // Se não carregou ainda o gameState, exibe loading
  if (!gameState || !gameState.state) {
    return <p>Carregando detalhes do jogo...</p>;
  }

  // Lógica para pintar as células pretas ('*') ou brancas
  const renderBoard = () => {
    const { cols, state } = gameState;
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 30px)`, gap: "2px" }}>
        {state.flat().map((cell, index) => (
          <div
            key={index}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: cell === "*" ? "black" : "white",
              border: "1px solid gray",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>GameState ID: {gameState.id}</h1>
      <p><strong>Status:</strong> {gameState.status || "Em andamento"}</p>

      <h2>Tabuleiro</h2>
      {renderBoard()}

      {/* Botões de controle */}
      <div style={{ marginTop: "20px" }}>
        {/* Botão manual de próxima geração */}
        <button onClick={handleNextGeneration}>Próxima Geração</button>

        {/* Botão de Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ marginLeft: "10px", backgroundColor: isPlaying ? "orange" : "green", color: "white" }}
        >
          {isPlaying ? "Pausar" : "Play"}
        </button>

        {/* Botão de Reset */}
        <button
          onClick={handleResetGame}
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        >
          Resetar Jogo
        </button>

        {/* Botão Voltar */}
        <button onClick={() => navigate("/gamestates")} style={{ marginLeft: "10px" }}>
          Voltar
        </button>
      </div>

      {/* Ajuste de velocidade */}
      <div style={{ marginTop: "20px" }}>
        <label>Velocidade (ms): </label>
        <input
          type="number"
          value={intervalSpeed}
          onChange={(e) => setIntervalSpeed(Number(e.target.value))}
          min="100"
          step="100"
        />
      </div>
    </div>
  );
};

export default GameStateShow;
