import { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPuzzlePiece } from "react-icons/fa";
import config from "../config";

const NewGameStatePage = () => {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [hasGameStates, setHasGameStates] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing game states to check if there are any
    const fetchGameStates = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/game_states`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setHasGameStates(data.length > 0);
      } catch (error) {
        console.error("Error fetching game states:", error);
      }
    };

    fetchGameStates();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({
        title: "Error",
        text: "Please select a .txt file!",
        icon: "error",
        heightAuto: false
      });
      return;
    }

    const formData = new FormData();
    formData.append("game_state[input_file]", file);

    try {
      const response = await fetch(`${config.apiBaseUrl}/game_states`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.base ? data.base.join("\n") : "Unknown error processing the file";
        throw new Error(errorMessage);
      }

      navigate(`/gamestates/${data.id}`, { state: { showSuccessMessage: true } });

    } catch (error) {
      console.error("API error:", error);
      Swal.fire({
        title: "Error creating GameState",
        text: error.message,
        icon: "error",
        customClass: {
          confirmButton: "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-400",
          cancelButton: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400",
        },
        heightAuto: false
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "");
  };

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 m-10">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
        {/* Left section: Instructions and File Example */}
        <div className="px-4 sm:px-0 flex justify-center items-end flex-col">
          <button
            onClick={() => navigate("/gamestates")}
            className="self-start bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 flex items-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={!hasGameStates}
          >
            <FaPuzzlePiece />
            Games List
          </button>
          <h2 className="text-base font-semibold text-gray-900 mt-4">File Format</h2>
          <p className="mt-1 text-sm text-gray-600">
            Before playing, check the file format you can upload. We don&apos;t want to accidentally create a parallel universe!
          </p>
          <code className="bg-black rounded-lg p-4 inline-block self-center mt-3 text-sm text-gray-300">
            <p>Generation 1:</p>
            <p>4 8</p>
            <p>........</p>
            <p>....*...</p>
            <p>...**...</p>
            <p>........</p>
          </code>
          <p className="mt-1 text-sm text-gray-600">
            The file needs to be in <strong>.txt</strong> format. We don&apos;t want Conway rolling in his grave!
          </p>
        </div>

        {/* Right section: Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 p-6"
        >
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-gray-900">Choose your file</label>
              <div className="mt-2 flex items-center rounded-md bg-white px-3 py-1.5 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  required
                  className="w-full text-sm text-gray-900 focus:outline-none"
                />
              </div>
              {fileName && <p className="mt-2 text-sm text-gray-600">Selected file: {fileName}</p>}
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="submit"
              className="mt-5 flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGameStatePage;
