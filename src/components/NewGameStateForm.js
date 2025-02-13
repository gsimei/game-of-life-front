import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Adicione isso para corrigir o erro de 'navigate'

const NewGameStateForm = () => {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null); // Defina o estado para 'file'
  const navigate = useNavigate(); // Defina 'navigate' corretamente

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("game_state[input_file]", file);

    try {
      const response = await fetch("http://localhost:3000/api/v1/game_states", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` // 'token' já está definido corretamente
        },
        body: formData
      });

      if (!response.ok) throw new Error("Falha ao criar novo GameState");

      const data = await response.json();
      console.log("GameState criado:", data);

      // Redireciona para o novo GameState após a criação
      navigate(`/gamestates/${data.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Selecione o arquivo .txt:
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])} // Atualiza 'file' no estado
        />
      </label>
      <button type="submit">Criar GameState</button>
    </form>
  );
};

export default NewGameStateForm;
