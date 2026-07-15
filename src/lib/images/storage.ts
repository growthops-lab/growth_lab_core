import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd());

function isInsideWorkspace(resolvedPath: string) {
  const relative = path.relative(workspaceRoot, resolvedPath);
  return (
    relative === "" ||
    (!relative.startsWith("..") && !path.isAbsolute(relative))
  );
}

export function imageStorageDir() {
  const configured =
    process.env.IMAGE_STORAGE_DIR ?? "./public/generated-images";
  const resolved = path.resolve(workspaceRoot, configured);
  if (!isInsideWorkspace(resolved)) {
    throw new Error(
      "IMAGE_STORAGE_DIR must stay inside the project workspace.",
    );
  }
  return resolved;
}

export function imagePublicBaseUrl() {
  return (process.env.IMAGE_PUBLIC_BASE_URL ?? "/generated-images").replace(
    /\/$/,
    "",
  );
}

export async function saveGeneratedImage(filename: string, content: string) {
  if (filename !== path.basename(filename) || filename.includes("..")) {
    throw new Error("Generated image filename must not contain path segments.");
  }
  if (!filename.endsWith(".svg")) {
    throw new Error("Phase 3 mock image generation only supports SVG files.");
  }
  const dir = imageStorageDir();
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  await writeFile(filePath, content, "utf8");
  const fileInfo = await stat(filePath);
  const url = `${imagePublicBaseUrl()}/${filename}`;
  return {
    localFileUrl: url,
    publicUrl: url,
    fileSize: fileInfo.size,
  };
}
