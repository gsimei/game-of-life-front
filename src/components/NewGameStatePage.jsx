import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NewGameStatePage = () => {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire("Erro", "Por favor, selecione um arquivo .txt!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("game_state[input_file]", file);

    try {
      const response = await fetch("http://localhost:3000/api/v1/game_states", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.base ? data.base.join("\n") : "Erro desconhecido ao processar o arquivo";
        throw new Error(errorMessage);
      }

      Swal.fire({
        title: "Sucesso!",
        text: "GameState criado com sucesso!",
        icon: "success",
      }).then(() => navigate(`/gamestates/${data.id}`));
    } catch (error) {
      console.error("Erro na API:", error);
      Swal.fire({
        title: "Erro ao criar GameState",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="space-y-10 divide-y divide-gray-900/10 max-w-3xl mx-auto">
        {/* Informações sobre o formato do arquivo */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0 flex justify-center items-end flex-col">
            <h2 className="text-lg font-semibold text-gray-900">Formato do Arquivo</h2>
            <p className="mt-1 text-sm text-gray-600">
              Antes de jogar, verifique o formato do arquivo que você pode enviar.
            </p>
            <code className="bg-black rounded-lg p-4 text-sm text-gray-300">
              <p>Generation 1:</p>
              <p>4 8</p>
              <p>........</p>
              <p>....*...</p>
              <p>...**...</p>
              <p>........</p>
            </code>
            <p className="mt-1 text-sm text-gray-600">
              O arquivo precisa estar no formato .txt.
            </p>
          </div>

          {/* Formulário de upload */}
          <div className="bg-white shadow ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">Escolha seu arquivo</label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-x-6 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/gamestates")}
                  className="text-sm font-semibold text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus:outline-none"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGameStatePage;
