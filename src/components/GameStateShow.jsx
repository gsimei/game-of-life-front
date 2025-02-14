import { useCallback, useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaPlay, FaPause, FaStepForward, FaRedo } from "react-icons/fa";
import Swal from "sweetalert2";

const GameStateShow = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [gameState, setGameState] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Exibe a mensagem de sucesso se necessário
  useEffect(() => {
    if (location.state?.showSuccessMessage) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "GameState criado com sucesso!",
        width: "20rem",
        showConfirmButton: false,
        timer: 1000,
        heightAuto: false
      });
    }
  }, [location.state]);

  // Busca inicial do GameState
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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

  // ✅ Usando useCallback para evitar recriação da função
  const handleNextGeneration = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}/next_generation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao avançar para a próxima geração");
      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error(error);
    }
  }, [id, token]); // ✅ Agora a função
  // Função para resetar o jogo
  const handleResetGame = async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}/reset_to_initial`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao resetar o jogo");
      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Função para deletar o GameState
  const handleDeleteGame = async () => {
    if (!id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/v1/game_states/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao deletar o game state");

      navigate("/gamestates", { state: { showSuccessMessage: true } });

    } catch (error) {
      console.error(error);
    }
  };

  // Iniciar/parar simulação com setInterval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleNextGeneration();
      }, 200); // Velocidade fixa de 200ms
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, handleNextGeneration]); // 🔥 Incluímos handleNextGeneration aqui

  if (!gameState || !gameState.state) {
    return <p className="text-center text-gray-600">Carregando detalhes do jogo...</p>;
  }

  // Renderiza o tabuleiro
  const renderBoard = () => {
    const { cols, state } = gameState;
    return (
      <div className="w-full overflow-auto pb-4"> {/* Container com scroll para telas pequenas */}
        <div
          className="grid gap-px bg-black mx-auto p-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${state.length}, minmax(0, 1fr))`,
            aspectRatio: cols / state.length, // Manter proporção do tabuleiro
            maxWidth: "90vh", // Limitar tamanho máximo baseado na altura da viewport
            width: "100%", // Ocupar largura total disponível
          }}
        >
          {state.flat().map((cell, index) => (
            <div
              key={index}
              className={`${cell === "*" ? "bg-white" : "bg-black"}
                aspect-square w-full transition-colors duration-100 ease-in-out`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 m-4 md:m-10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-4">        {/* Painel esquerdo */}
        <div className="px-4 sm:px-0 flex justify-start items-end flex-col md:col-span-1">
          <button
            onClick={() => navigate("/gamestates")}
            className="flex gap-3 justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Back
          </button>
          <h2 className="text-base font-semibold text-gray-900 mt-4">Game State</h2>
          <p className="mt-1 text-sm text-gray-600">Keep an eye on those cells! They might just start a revolution.</p>

          {/* Botões de controle */}
          <div className="flex mt-4 gap-5">
            <button onClick={handleResetGame} className="text-yellow-500">
              <FaRedo size={24} />
            </button>
            <button onClick={handleNextGeneration} className="text-blue-500">
              <FaStepForward size={24} />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className={isPlaying ? "text-orange-500" : "text-green-500"}>
              {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
            </button>
            <button onClick={handleDeleteGame} className="text-red-500">
              <FaTrash size={24} />
            </button>
          </div>
        </div>

        {/* Tabuleiro do Jogo */}
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-3 p-4">
          <h2 className="text-base font-semibold text-gray-900">Generation {gameState.generation}</h2>
          <p className="mt-1 text-sm text-gray-600">Population: {gameState.alived_cells_count}</p>
          <div className="block md:hidden text-center text-red-500 mb-4 landscape:hidden">
            Rotacione o dispositivo para uma melhor experiência.
          </div>
          {renderBoard()}
        </div>
      </div>
    </div>
  );
};

export default GameStateShow;
