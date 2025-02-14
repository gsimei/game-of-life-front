import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const GameStates = () => {
  const { token } = useContext(AuthContext);
  const [gameStates, setGameStates] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchGameStates = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/game_states", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar os game states");
        }

        const data = await response.json();
        setGameStates(data);

        // Redireciona para a página de criação se não houver game states
        if (data.length === 0) {
          navigate("/gamestates/new");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchGameStates();
  }, [token, navigate]);

  useEffect(() => {
    if (location.state?.showSuccessMessage) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "GameState deletado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
        heightAuto: false
      });
    }
  }, [location.state]);

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 m-10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        {/* Lado esquerdo - informações */}
        <div className="px-4 sm:px-0 flex justify-start items-end flex-col">
          <button
            onClick={() => navigate("/gamestates/new")}
            className="flex gap-3 justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                clipRule="evenodd"
              />
            </svg>
            New Game
          </button>
          <h2 className="text-base font-semibold text-gray-900 mt-4">Your Game States</h2>
          <p className="mt-1 text-sm text-gray-600">Explore all your universes here. Who knows, you might find some life!</p>
        </div>

        {/* Lado direito - Lista de Game States */}
        <ul role="list" className="divide-y divide-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
          {gameStates.length === 0 ? (
            <li className="relative flex justify-center px-4 py-5 text-gray-500">Carregando game states...</li>
          ) : (
            gameStates.map((gameState) => (
              <li key={gameState.id} className="relative flex justify-between gap-x-6 px-4 py-5 sm:px-6 lg:px-8">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold text-gray-900">Generation {gameState.generation}</p>
                    <div className="flex gap-3">
                      <p className="mt-1 flex text-xs text-gray-500">Population: {gameState.alived_cells_count}</p>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <button
                    onClick={() => navigate(`/gamestates/${gameState.id}`)}
                    className="inline-block"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      <path
                        fillRule="evenodd"
                        d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default GameStates;
