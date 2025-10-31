import { spawn } from "child_process";
import { test } from "node:test";
import assert from "node:assert";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test("MCP server should not write to stdout on startup", async () => {
  const indexPath = path.join(__dirname, "..", "index.js");

  return new Promise((resolve, reject) => {
    const child = spawn("node", [indexPath], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdoutData = "";
    let stderrData = "";

    child.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    // Wait 500ms then kill the process and check stdout
    setTimeout(() => {
      child.kill("SIGTERM");

      // Allow time for process to clean up
      setTimeout(() => {
        try {
          // Assert that stdout is empty (no plain text logging)
          assert.strictEqual(
            stdoutData.trim(),
            "",
            "stdout should be empty on startup - MCP protocol uses stdout for JSON-RPC messages only"
          );

          // Verify that stderr contains our log message (optional, but good to confirm logs are going somewhere)
          assert.ok(
            stderrData.includes("Gluestack") && stderrData.includes("MCP Server"),
            "stderr should contain startup message with 'Gluestack' and 'MCP Server'"
          );

          resolve();
        } catch (err) {
          reject(err);
        }
      }, 100);
    }, 500);

    child.on("error", (err) => {
      reject(err);
    });
  });
});
