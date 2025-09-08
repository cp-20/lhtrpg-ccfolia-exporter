const colorPicker = document.querySelector<HTMLInputElement>("#map-color");
if (!colorPicker) throw new Error("カラーピッカーが見つかりません");

const gridCheckbox = document.querySelector<HTMLInputElement>("#map-grid");
if (!gridCheckbox) throw new Error("グリッドチェックボックスが見つかりません");

const crosshairCheckbox = document.querySelector<HTMLInputElement>(
  "#map-crosshair",
);
if (!crosshairCheckbox) {
  throw new Error("中央クロスヘアチェックボックスが見つかりません");
}

const canvas = document.querySelector<HTMLCanvasElement>("#map-output");
if (!canvas) throw new Error("マップ出力が見つかりません");

let ctx: CanvasRenderingContext2D;
let mapSize: number;
const cellSize = 48;
const headerSize = 36;
let mapState: (string | null)[][];

const drawGrid = () => {
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 2;
  ctx.font = `bold ${cellSize * 0.4}px 'Helvetica Neue'`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#333";

  // Draw headers
  for (let i = 0; i < mapSize; i++) {
    // Top headers (A, B, C...)
    ctx.fillText(
      String.fromCharCode(65 + i),
      headerSize + i * cellSize + cellSize / 2,
      headerSize / 2,
    );
    // Side headers (1, 2, 3...)
    ctx.fillText(
      (i + 1).toString(),
      headerSize / 2,
      headerSize + i * cellSize + cellSize / 2,
    );
  }

  // Redraw filled cells
  for (let y = 0; y < mapSize; y++) {
    for (let x = 0; x < mapSize; x++) {
      if (mapState[y][x]) {
        ctx.fillStyle = mapState[y][x]!;
        ctx.fillRect(
          headerSize - 1 + x * cellSize,
          headerSize - 1 + y * cellSize,
          cellSize,
          cellSize,
        );
      }
    }
  }

  // Draw grid lines
  if (gridCheckbox.checked) {
    for (let i = 0; i <= mapSize; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(headerSize - 1 + i * cellSize, headerSize - 1);
      ctx.lineTo(
        headerSize - 1 + i * cellSize,
        headerSize - 1 + mapSize * cellSize,
      );
      if (i === 0 || i === mapSize) {
        ctx.setLineDash([]); // solid for outer border
      } else {
        ctx.setLineDash([6, 4]); // dashed for inner lines
      }
      ctx.stroke();

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(headerSize - 1, headerSize - 1 + i * cellSize);
      ctx.lineTo(
        headerSize - 1 + mapSize * cellSize,
        headerSize - 1 + i * cellSize,
      );
      if (i === 0 || i === mapSize) {
        ctx.setLineDash([]); // solid for outer border
      } else {
        ctx.setLineDash([6, 4]); // dashed for inner lines
      }
      ctx.stroke();
    }
    ctx.setLineDash([]); // reset to solid after drawing
  }

  // Draw crosshair
  if (crosshairCheckbox.checked) {
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    for (let y = 0; y < mapSize; y++) {
      for (let x = 0; x < mapSize; x++) {
        const cellX = headerSize - 1 + x * cellSize;
        const cellY = headerSize - 1 + y * cellSize;
        const centerX = cellX + cellSize / 2;
        const centerY = cellY + cellSize / 2;
        const crossSize = 4;

        // Horizontal line
        ctx.beginPath();
        ctx.moveTo(centerX - crossSize, centerY);
        ctx.lineTo(centerX + crossSize, centerY);
        ctx.stroke();

        // Vertical line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - crossSize);
        ctx.lineTo(centerX, centerY + crossSize);
        ctx.stroke();
      }
    }
  }
};

canvas.addEventListener("click", (e: MouseEvent) => {
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x > headerSize && y > headerSize) {
    const gridX = Math.floor((x - headerSize) / cellSize);
    const gridY = Math.floor((y - headerSize) / cellSize);

    if (gridX < mapSize && gridY < mapSize) {
      mapState[gridY][gridX] = colorPicker.value;
      drawGrid();
    }
  }
});

gridCheckbox.addEventListener("change", () => {
  drawGrid();
});

crosshairCheckbox.addEventListener("change", () => {
  drawGrid();
});

export const initializeMap = (size: number) => {
  mapSize = size;
  mapState = Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));

  const canvasSize = headerSize + size * cellSize;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const canvasCtx = canvas.getContext("2d");
  if (!canvasCtx) throw new Error("Canvasのコンテキストが取得できません");
  ctx = canvasCtx;

  drawGrid();
};

export const exportMap = () => {
  if (!canvas) return;
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "map.png";
  link.click();
  link.remove();
};
