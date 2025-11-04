import { writeFile } from "fs/promises";
import path from "path";
import { createCanvas } from "canvas";

// Simple stickman image generator using canvas
export async function generateStickmanImage(
  description: string,
  outputPath: string
): Promise<void> {
  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 1280, 720);

  // Draw a simple stickman based on description
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";

  const centerX = 640;
  const centerY = 360;

  // Draw basic stickman (can be enhanced based on description)
  // Head
  ctx.beginPath();
  ctx.arc(centerX, centerY - 100, 40, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 60);
  ctx.lineTo(centerX, centerY + 50);
  ctx.stroke();

  // Arms - vary position based on keywords in description
  const leftArmAngle = description.toLowerCase().includes("waving") ? -Math.PI / 4 : Math.PI / 6;
  const rightArmAngle = description.toLowerCase().includes("waving") ? -Math.PI / 4 : Math.PI / 6;

  // Left arm
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 40);
  ctx.lineTo(centerX - 60 * Math.cos(leftArmAngle), centerY - 40 + 60 * Math.sin(leftArmAngle));
  ctx.stroke();

  // Right arm
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - 40);
  ctx.lineTo(centerX + 60 * Math.cos(rightArmAngle), centerY - 40 + 60 * Math.sin(rightArmAngle));
  ctx.stroke();

  // Legs - vary if jumping or walking
  const legSpread = description.toLowerCase().includes("jumping") ? 80 : 50;
  
  // Left leg
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 50);
  ctx.lineTo(centerX - legSpread / 2, centerY + 150);
  ctx.stroke();

  // Right leg
  ctx.beginPath();
  ctx.moveTo(centerX, centerY + 50);
  ctx.lineTo(centerX + legSpread / 2, centerY + 150);
  ctx.stroke();

  // Add text description at the bottom
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.textAlign = "center";
  const maxWidth = 1100;
  const words = description.split(" ");
  let line = "";
  let y = 650;

  for (let word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line, centerX, y);
      line = word + " ";
      y += 30;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, centerX, y);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  await writeFile(outputPath, buffer);
}
