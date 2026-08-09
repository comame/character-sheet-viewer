import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { character, parseCharacter } from "./character";
import { CharacterSheet } from "./characterSheet";
import { Button } from "./button";
import { Footer } from "./footer";
import { DeleteForeverSVG } from "./icons";
import { CharacterSheets } from "./characterSheets";

function loadCharacters(): character[] {
  const json = localStorage.getItem("characters");
  if (!json) return [];

  try {
    const arr = JSON.parse(json);
    return arr.map((c: any) => parseCharacter(JSON.stringify(c)));
  } catch (e) {
    console.error(e);
    return [];
  }
}

function App() {
  const [characters, setCharacters] = useState<character[]>(loadCharacters());

  useEffect(() => {
    localStorage.setItem("characters", JSON.stringify(characters));
  }, [characters]);

  const addCharacterFromClipboard = async () => {
    try {
      const clip = await navigator.clipboard.readText();
      const c = parseCharacter(clip);
      setCharacters((prev) => [...prev, c]);
    } catch (e) {
      alert("読み込み失敗");
      console.error(e);
    }
  };

  const deleteAllCharacters = () => {
    if (!confirm("本当に削除しますか？")) return;
    setCharacters([]);
  };

  const onPaste = (e: ClipboardEvent) => {
    addCharacterFromClipboard();
  };
  useEffect(() => {
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  return (
    <div className="App">
      <CharacterSheets characters={characters} setCharacters={setCharacters} />
      <Footer
        addCharacterFromClipboard={addCharacterFromClipboard}
        deleteAllCharacters={deleteAllCharacters}
      />
    </div>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
