import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NewGameStateForm from "./NewGameStateForm"; // Importa o formulário

const GameStates = () => {
  const { token, logout } = useContext(AuthContext);
  const [gameStates, setGameStates] = useState([]);
  const [showForm, setShowForm] = useState(false); // Estado para controlar o formulário
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGameStates = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/game_states", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os game states");
        }

        const data = await response.json();
        setGameStates(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameStates();
  }, [token]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Game States</h1>
      <button onClick={handleLogout}>Logout</button>

      {/* Botão para exibir o formulário de criação */}
      <button onClick={() => setShowForm(!showForm)} style={{ marginLeft: "10px" }}>
        {showForm ? "Fechar" : "Novo GameState"}
      </button>

      {/* Exibe o formulário se showForm for true */}
      {showForm && <NewGameStateForm />}

      {gameStates.length === 0 ? (
        <p>Carregando game states...</p>
      ) : (
        <ul>
          {gameStates.map((gameState) => (
            <li key={gameState.id}>
              <strong>ID:</strong> {gameState.id} - <strong>Status:</strong> {gameState.status}
              <button onClick={() => navigate(`/gamestates/${gameState.id}`)}>Ver Detalhes</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GameStates;
