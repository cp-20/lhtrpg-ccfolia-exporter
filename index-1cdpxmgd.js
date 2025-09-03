// lhtrpg.ts
var fetchLhtrpgData = async (id) => {
  const res = await fetch(`https://lhrpg.com/lhz/api/${id}.json`);
  if (!res.ok)
    throw new Error("キャラクター情報の取得に失敗しました");
  const characterData = await res.json();
  return characterData;
};

// convert.ts
var convert = async (id) => {
  const character = await fetchLhtrpgData(id);
  const equipments = [
    character.hand1 ? `手：${character.hand1.name}` : null,
    character.hand2 ? `手：${character.hand2.name}` : null,
    character.armor ? `防具：${character.armor.name}` : null,
    character.support_item1 ? `補助装備：${character.support_item1.name}` : null,
    character.support_item2 ? `補助装備：${character.support_item2.name}` : null,
    character.support_item3 ? `補助装備：${character.support_item3.name}` : null,
    character.bag ? `鞄：${character.bag.name}` : null
  ].filter((e) => e !== null).join(`
`);
  const items = character.items.filter((item) => item !== null).map((item) => item.name).join(`
`);
  const memo = `
${character.name} (Lv.${character.level}) CR${character.character_rank}
${character.race} ー ${character.main_job} / ${character.sub_job}

〇装備アイテム
${equipments}

〇所持アイテム
${items}
`.split(`
`).slice(1, -1).join(`
`);
  const status = [
    { label: "HP", value: character.max_hitpoint, max: character.max_hitpoint },
    { label: "因果力", value: character.effect, max: character.effect },
    { label: "疲労", value: 0, max: 0 },
    { label: "ヘイト", value: 0, max: 0 },
    { label: "物防", value: character.physical_defense, max: 0 },
    { label: "魔防", value: character.magic_defense, max: 0 }
  ];
  const params = [
    { label: "攻撃力", value: `${character.physical_attack}` },
    { label: "魔力", value: `${character.magic_attack}` },
    { label: "回復力", value: `${character.heal_power}` },
    { label: "移動力", value: `${character.move}` },
    { label: "STR", value: `${character.str_value}` },
    { label: "STR基本値", value: `${character.str_basic_value}` },
    { label: "DEX", value: `${character.dex_value}` },
    { label: "DEX基本値", value: `${character.dex_basic_value}` },
    { label: "POW", value: `${character.pow_value}` },
    { label: "POW基本値", value: `${character.pow_basic_value}` },
    { label: "INT", value: `${character.int_value}` },
    { label: "INT基本値", value: `${character.int_basic_value}` }
  ];
  const commands = `
${character.abl_motion} 〈運動〉
${character.abl_durability} 〈耐久〉
${character.abl_dismantle} 〈解除〉
${character.abl_operate} 〈操作〉
${character.abl_sense} 〈知覚〉
${character.abl_negotiate} 〈交渉〉
${character.abl_knowledge} 〈知識〉
${character.abl_analyze} 〈解析〉
${character.abl_avoid} 〈回避〉
${character.abl_resist} 〈抵抗〉
${character.abl_hit} 〈命中〉
`.split(`
`).slice(1, -1).join(`
`);
  const exportData = {
    kind: "character",
    data: {
      name: character.name,
      memo,
      initiative: character.action + 0.1,
      width: 4,
      height: 4,
      externalUrl: character.sheet_url,
      status,
      params,
      commands
    }
  };
  return JSON.stringify(exportData);
};

// main.ts
var form = document.querySelector("#input-form");
if (!form)
  throw new Error("フォームが見つかりません");
var characterInput = document.querySelector("#character-input");
if (!characterInput)
  throw new Error("キャラクター入力が見つかりません");
var output = document.querySelector("#output");
if (!output)
  throw new Error("出力エリアが見つかりません");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = characterInput.value;
  if (!input)
    return;
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
  if (!characterId)
    return;
  const converted = await convert(characterId);
  output.value = converted;
});
