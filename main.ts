import { convert } from "./convert";

const form = document.querySelector<HTMLFormElement>("#input-form");
if (!form) throw new Error("フォームが見つかりません");

const characterInput = document.querySelector<HTMLInputElement>(
  "#character-input",
);
if (!characterInput) throw new Error("キャラクター入力が見つかりません");

const output = document.querySelector<HTMLTextAreaElement>("#output");
if (!output) throw new Error("出力エリアが見つかりません");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const input = characterInput.value;
  if (!input) return;

  const characterId = (() => {
    const match = input.match(/^https:\/\/lhrpg\.com\/lhz\/(?:\w+)\?id=(\d+)$/);
    if (match !== null) {
      return match[1];
    }

    const match2 = input.match(/^(\d+)$/);
    if (match2 !== null) {
      return input;
    }

    alert("URLかIDを入力してください");
  })();

  if (!characterId) return;

  const converted = await convert(characterId);

  output.value = converted;
});
