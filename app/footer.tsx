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
