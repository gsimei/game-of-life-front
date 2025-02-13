import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NewGameStateForm = () => {
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
        // 🚀 Pegamos o erro correto da chave `base`
        const errorMessage = data.base ? data.base.join("\n") : "Erro desconhecido ao processar o arquivo";
        throw new Error(errorMessage);
      }

      Swal.fire({
        title: "Sucesso!",
        text: "GameState criado com sucesso!",
        icon: "success",
      }).then(() => navigate(`/gamestates/${data.id}`));

    } catch (error) {
      console.error("Erro na API:", error); // Para depuração
      Swal.fire({
        title: "Erro ao criar GameState",
        text: error.message, // Agora pegamos o erro corretamente
        icon: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Selecione o arquivo .txt:
        <input type="file" accept=".txt" onChange={(e) => setFile(e.target.files[0])} />
      </label>
      <button type="submit">Criar GameState</button>
    </form>
  );
};

export default NewGameStateForm;
