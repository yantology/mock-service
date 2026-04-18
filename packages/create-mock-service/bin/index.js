#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prompts from "prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");

// Read version from package.json
const packageJsonPath = path.resolve(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const VERSION = packageJson.version;

async function main() {
  const args = process.argv.slice(2);

  // Handle --version flag
  if (args.includes("--version") || args.includes("-v")) {
    console.log(`create-mock-service v${VERSION}`);
    process.exit(0);
  }

  let projectName = args[0];

  if (!projectName) {
    const response = await prompts({
      type: "text",
      name: "projectName",
      message: "Project name:",
      initial: "my-mock-api",
      validate: (value) => value.length > 0 || "Project name is required",
    });
    projectName = response.projectName;
  }

  if (!projectName) {
    console.log("❌ Project name is required");
    process.exit(1);
  }

  const configResponse = await prompts([
    {
      type: "text",
      name: "apiTitle",
      message: "API title:",
      initial: projectName,
    },
    {
      type: "text",
      name: "apiDescription",
      message: "API description:",
      initial: `Mock API for ${projectName}`,
    },
  ]);

  const apiTitle = configResponse.apiTitle || projectName;
  const apiDescription =
    configResponse.apiDescription || `Mock API for ${projectName}`;

  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Folder "${projectName}" already exists.`);
    process.exit(1);
  }

  const templates = fs.readdirSync(TEMPLATES_DIR);

  let template = templates[0];
  if (templates.length > 1) {
    const response = await prompts({
      type: "select",
      name: "template",
      message: "Choose template:",
      choices: templates.map((name) => ({ title: name, value: name })),
    });
    template = response.template;
  }

  const templateDir = path.join(TEMPLATES_DIR, template);

  console.log(`\n🚀 create-mock-service v${VERSION}`);
  console.log(`   Creating project "${projectName}"...`);
  copyDir(templateDir, targetDir);

  // Update package.json name
  const pkgPath = path.join(targetDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  pkg.name = projectName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

  // Update wrangler.toml name
  const wranglerPath = path.join(targetDir, "wrangler.toml");
  if (fs.existsSync(wranglerPath)) {
    let wrangler = fs.readFileSync(wranglerPath, "utf-8");
    wrangler = wrangler.replace(/name = "[^"]+"/, `name = "${projectName}"`);
    fs.writeFileSync(wranglerPath, wrangler);
  }

  // Update mock.config.ts title and description
  const configPath = path.join(targetDir, "mock.config.ts");
  if (fs.existsSync(configPath)) {
    let config = fs.readFileSync(configPath, "utf-8");
    config = config.replace(/title: 'My Mock API'/, `title: '${apiTitle}'`);
    config = config.replace(
      /description: 'Mock API service built with create-mock-service'/,
      `description: '${apiDescription}'`,
    );
    fs.writeFileSync(configPath, config);
  }

  console.log(`\n✅ Project "${projectName}" created successfully!`);
  console.log(`   create-mock-service v${VERSION}\n`);
  console.log(`Next steps:`);
  console.log(`  cd ${projectName}`);
  console.log(`  bun install`);
  console.log(`  bun run dev\n`);
  console.log(`Swagger UI: http://localhost:8787/docs`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (
      entry.name === "node_modules" ||
      entry.name === ".wrangler" ||
      entry.name === ".git"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
