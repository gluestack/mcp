import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";
import { z } from "zod";

const COMPONENTS_DIR = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "src/components/"
);

const latestPrompt = `You are a React and React Native expert. Generate COMPLETE and RUNNABLE code using only my design system components and tools sequentially: get_all_components_metadata, select_components, get_selected_components_docs. Requirements: no external component libraries, no HTML tags (<div>, <button>, <input>, etc), no StyleSheet, use TailwindCSS classes via className prop. Images must be from unsplash.com only. Import all components individually. Prefer VStack/HStack over Box component. Ensure screens are scrollable, responsive, and mobile-friendly.`;

// Initializes an MCP server
const server = new McpServer({
  name: "use-gluestack-components",
  version: "1.0.0",
  systemPrompt: latestPrompt,
});

function getAvailableComponents() {
  try {
    // Get all markdown files in the components directory
    const componentFiles = fs
      .readdirSync(COMPONENTS_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(".md", ""));

    return componentFiles;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(componentFiles),
        },
      ],
    };
  } catch (error) {
    console.error(`Error reading components directory: ${error.message}`);

    return [];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify([]),
        },
      ],
    };
  }
}

function getComponentMetadata(componentName) {
  try {
    const docPath = path.join(
      COMPONENTS_DIR,
      `${componentName.toLowerCase()}.md`
    );

    if (!fs.existsSync(docPath)) {
      return { title: componentName, description: "Component not found" };
    }

    const docsContent = fs.readFileSync(docPath, "utf-8");
    const lines = docsContent.split("\n");

    // Check if file starts with frontmatter
    if (lines[0].trim() !== "---") {
      return { title: componentName, description: "No description available" };
    }

    // Extract only title and description
    const metadata = {
      title: componentName,
      description: "No description available",
    };

    // Read until the closing frontmatter delimiter
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line === "---") break;

      if (line.startsWith("title:")) {
        metadata.title = line.split(":")[1].trim();
      } else if (line.startsWith("description:")) {
        metadata.description = line.split(":")[1].trim();
      }
    }

    return metadata;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata),
        },
      ],
    };
  } catch (error) {
    console.error(
      `Error reading metadata for ${componentName}: ${error.message}`
    );

    return {
      title: componentName,
      description: "Error reading metadata",
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            title: componentName,
            description: "Error reading metadata",
          }),
        },
      ],
    };
  }
}

function getAllComponentsMetadata() {
  const components = getAvailableComponents();
  const metadata = {};

  components.forEach((component) => {
    const meta = getComponentMetadata(component);
    if (meta) {
      metadata[component] = meta;
    }
  });

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(metadata, null, 2),
      },
    ],
  };
}

function getComponentDocs(componentName) {
  try {
    const docPath = path.join(
      COMPONENTS_DIR,
      `${componentName.toLowerCase()}.md`
    );

    // Check if the file exists
    if (!fs.existsSync(docPath)) {
      return `Documentation not found for component: ${componentName}`;
    }

    // Read the markdown file
    const docsContent = fs.readFileSync(docPath, "utf-8");

    return (
      docsContent || `Empty documentation file for component: ${componentName}`
    );

    return {
      content: [
        {
          type: "text",
          text:
            docsContent ||
            `Empty documentation file for component: ${componentName}`,
        },
      ],
    };
  } catch (error) {
    return `Error retrieving documentation for ${componentName}: ${error.message}`;
  }
}

function getSelectedComponentsDocs(componentNames) {
  const docsObject = {};
  console.log(
    `✅ Getting documentation for components: ${componentNames.join(", ")}`
  );

  for (const componentName of componentNames) {
    docsObject[componentName] = getComponentDocs(componentName);
  }

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(docsObject, null, 2),
      },
    ],
  };
}

server.tool(
  "get_all_components_metadata",
  "Read and gives the metadata of all the components",
  {},
  () => getAllComponentsMetadata()
);

server.tool(
  "select_components",
  "Selects the components you need",
  {
    selectedComponents: z
      .array(z.string())
      .describe("The names of the components"),
  },
  (input) => {
    console.log(
      `✅ Selected components: ${input.selectedComponents.join(", ")}`
    );

    return {
      content: [
        {
          type: "text",
          text: `You have selected: ${input.selectedComponents.join(
            ", "
          )}. Now proceed to get full documentation for ALL these components at once using get_selected_components_docs.`,
        },
      ],
    };
  }
);

server.tool(
  "get_selected_components_docs",
  "Read and gives the complete documentation of selected components",
  {
    component_names: z
      .array(z.string())
      .describe("The names of the components"),
  },
  (input) => getSelectedComponentsDocs(input.component_names)
);

// Sets up the MCP server and establishes communication channel with the client using stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
