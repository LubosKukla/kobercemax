/* eslint-disable no-console */
const fs = require("fs/promises");
const path = require("path");
const fg = require("fast-glob");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET_DIRS = ["src/assets/img", "public/img"];
const MIN_BYTES_TO_PROCESS = 40 * 1024;

function formatMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const input = await fs.readFile(filePath);
  const inputSize = input.length;

  if (inputSize < MIN_BYTES_TO_PROCESS) {
    return { changed: false, inputSize, outputSize: inputSize, reason: "small" };
  }

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  let outputBuffer = null;

  if (ext === ".jpg" || ext === ".jpeg") {
    outputBuffer = await pipeline
      .jpeg({
        quality: 82,
        mozjpeg: true,
        progressive: true,
        chromaSubsampling: "4:4:4",
      })
      .toBuffer();
  } else if (ext === ".png") {
    outputBuffer = await pipeline
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        effort: 8,
      })
      .toBuffer();
  } else {
    return { changed: false, inputSize, outputSize: inputSize, reason: "unsupported" };
  }

  if (!outputBuffer || outputBuffer.length >= inputSize - 1024) {
    return { changed: false, inputSize, outputSize: inputSize, reason: "no-gain" };
  }

  await fs.writeFile(filePath, outputBuffer);
  return { changed: true, inputSize, outputSize: outputBuffer.length, reason: "optimized" };
}

async function main() {
  const patterns = TARGET_DIRS.map((dir) => `${dir}/**/*.{jpg,jpeg,png}`);
  const files = await fg(patterns, {
    cwd: ROOT,
    absolute: true,
    onlyFiles: true,
    dot: false,
  });

  let totalBefore = 0;
  let totalAfter = 0;
  let changedCount = 0;
  let skippedSmall = 0;
  let skippedNoGain = 0;
  let failedCount = 0;

  for (const file of files) {
    try {
      const result = await optimizeFile(file);
      totalBefore += result.inputSize;
      totalAfter += result.outputSize;

      if (result.changed) changedCount += 1;
      if (result.reason === "small") skippedSmall += 1;
      if (result.reason === "no-gain") skippedNoGain += 1;
    } catch (error) {
      const stat = await fs.stat(file);
      totalBefore += stat.size;
      totalAfter += stat.size;
      failedCount += 1;
      console.warn(`Failed: ${path.relative(ROOT, file)} (${error.message})`);
    }
  }

  const saved = totalBefore - totalAfter;
  const savedPct = totalBefore > 0 ? ((saved / totalBefore) * 100).toFixed(2) : "0.00";

  console.log("");
  console.log("Image optimization report");
  console.log("-------------------------");
  console.log(`Files scanned: ${files.length}`);
  console.log(`Files optimized: ${changedCount}`);
  console.log(`Skipped (small): ${skippedSmall}`);
  console.log(`Skipped (no gain): ${skippedNoGain}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Before: ${formatMB(totalBefore)}`);
  console.log(`After: ${formatMB(totalAfter)}`);
  console.log(`Saved: ${formatMB(saved)} (${savedPct}%)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
