import { Button } from "./button";

export function Footer({
  addCharacterFromClipboard,
  deleteAllCharacters,
}: {
  addCharacterFromClipboard: () => void;
  deleteAllCharacters: () => void;
}) {
  return (
    <div className="Footer">
      <div className="left">
        <a
          href="https://github.com/comame/character-sheet-viewer"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <div className="right">
        <Button kind="Primary" onClick={addCharacterFromClipboard}>
          クリップボードから貼り付け
        </Button>
        <Button kind="Danger" onClick={deleteAllCharacters}>
          すべて削除
        </Button>
      </div>
    </div>
  );
}
