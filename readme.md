# Gluestack Components MCP Server

This project provides a Model Context Protocol (MCP) server for integrating Gluestack components with Claude Desktop and Cursor IDE.

## Prerequisites

- Node.js (v14 or higher)
- Claude Desktop application OR Cursor IDE

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/gluestack/mcp.git
cd mcp
npm i
```

## Integration Options

You can use this MCP server with either Claude Desktop or Cursor IDE:

---

## Option 1: Claude Desktop Integration

### 2. Install Claude Desktop

Download and install Claude Desktop from the official Anthropic website if you haven't already.

### 3. Configure Claude Desktop MCP Server

You need to add this MCP server to your Claude Desktop configuration file.

#### For macOS and Linux:

**Using Cursor Editor:**

```bash
cursor ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Using VS Code:**

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### For Windows:

**Using VS Code:**

```powershell
code $env:AppData\Claude\claude_desktop_config.json
```

### 4. Update Configuration File

Add the following configuration to your `claude_desktop_config.json` file:

#### For macOS and Linux:

```json
{
  "mcpServers": {
    "your-mcp-server-name": {
      "command": "node",
      "args": ["/complete/path/to/your/project/index.js"]
    }
  }
}
```

#### For Windows:

```json
{
  "mcpServers": {
    "your-mcp-server-name": {
      "command": "node",
      "args": ["C:\\complete\\path\\to\\your\\project\\index.js"]
    }
  }
}
```

### 5. Start the MCP Server

Navigate to your project directory and run:

```bash
node index.js
```

### 6. Restart Claude Desktop

Close and reopen Claude Desktop application. You should now see the MCP server listed in the available tools menu.

### Verification for Claude Desktop

After following the setup steps:

1. Open Claude Desktop
2. Look for the MCP server in the tools menu, just below the input where you enter your prompt
3. You should see "your-mcp-server-name" listed as an available MCP server

---

## Option 2: Cursor IDE Integration

### 2. Start the MCP Server

First, start the MCP server by running:

```bash
node index.js
```

### 3. Setup MCP in Cursor

1. Open Cursor IDE
2. Navigate to **Settings** (top right corner)
3. Select **MCP** from the settings menu
4. Click **Add MCP** to add a new MCP server

### 4. Configure MCP Server in Cursor

Add the following configuration to your `mcp.json` file in Cursor:

#### For macOS and Linux:

```json
{
  "mcpServers": {
    "your-mcp-server-name": {
      "command": "node",
      "args": ["/complete/path/to/your/project/index.js"]
    }
  }
}
```

#### For Windows:

```json
{
  "mcpServers": {
    "your-mcp-server-name": {
      "command": "node",
      "args": ["C:\\complete\\path\\to\\your\\project\\index.js"]
    }
  }
}
```

### 5. Complete Setup

The MCP server will now be available directly in your Cursor IDE project. You can use the Gluestack components integration within your development workflow.

### Verification for Cursor

After setup:

1. Check that the MCP server appears in Cursor's MCP settings
2. Verify the server is running without errors
3. Test the integration in your project

---
