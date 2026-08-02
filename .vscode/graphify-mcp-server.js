#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let buffer = '';

function send(message) {
  const payload = JSON.stringify(message);
  const header = `Content-Length: ${Buffer.byteLength(payload, 'utf8')}\r\n\r\n`;
  process.stdout.write(header + payload);
}

function sendError(id, message, code = -32603) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

function readTextFromInput(input) {
  if (typeof input === 'string' && input.trim()) return input;
  if (input && input.path) {
    const baseDir = process.cwd();
    const targetPath = path.isAbsolute(input.path) ? input.path : path.join(baseDir, input.path);
    try {
      return fs.readFileSync(targetPath, 'utf8');
    } catch (err) {
      throw new Error(`Unable to read file: ${targetPath} (${err.message})`);
    }
  }
  throw new Error('Provide either text or a file path.');
}

function buildKnowledgeGraph(text, maxEntities = 20) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);

  const candidates = [];
  const seen = new Set();

  const tokenRegex = /[A-Za-z][A-Za-z0-9._-]{2,}/g;
  const terms = normalized.match(tokenRegex) || [];

  terms.forEach((term) => {
    const cleaned = term.replace(/[^A-Za-z0-9._-]/g, '').toLowerCase();
    if (!cleaned || cleaned.length < 3) return;
    if (!seen.has(cleaned)) {
      seen.add(cleaned);
      candidates.push(cleaned);
    }
  });

  const nodes = candidates.slice(0, maxEntities).map((name, idx) => ({ id: `node-${idx + 1}`, name, type: 'entity' }));
  const edges = [];

  const nodeNames = new Set(nodes.map((node) => node.name));
  const orderedTerms = Array.from(new Set(terms.map((term) => term.toLowerCase().replace(/[^a-z0-9._-]/g, '')).filter((term) => term.length >= 3)));

  for (let i = 0; i < orderedTerms.length - 1; i++) {
    const left = orderedTerms[i];
    const right = orderedTerms[i + 1];
    if (nodeNames.has(left) && nodeNames.has(right) && left !== right) {
      edges.push({ source: left, target: right, relation: 'co-occurs' });
    }
  }

  return {
    summary: `Detected ${nodes.length} entities and ${edges.length} relationships.`,
    nodes,
    edges,
    source: sentences[0] || normalized.slice(0, 160)
  };
}

function handleMessage(message) {
  const { id, method, params } = message;

  if (!method) {
    return sendError(id, 'Invalid request.', -32600);
  }

  if (method === 'initialize') {
    return send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'graphify-mcp', version: '0.1.0' }
      }
    });
  }

  if (method === 'notifications/initialized') {
    return;
  }

  if (method === 'tools/list') {
    return send({
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'build_knowledge_graph',
            description: 'Build a simple knowledge graph from a local file or pasted text.',
            inputSchema: {
              type: 'object',
              properties: {
                path: { type: 'string', description: 'Relative path to a text file in the workspace.' },
                text: { type: 'string', description: 'Raw text to analyze instead of a file.' },
                maxEntities: { type: 'integer', description: 'Maximum number of entities to return.', default: 20 }
              }
            }
          }
        ]
      }
    });
  }

  if (method === 'tools/call') {
    const toolName = params?.name;
    if (toolName !== 'build_knowledge_graph') {
      return sendError(id, `Unsupported tool: ${toolName}`);
    }

    try {
      const input = params?.arguments || {};
      const text = readTextFromInput(input);
      const maxEntities = Number(input.maxEntities || 20);
      const graph = buildKnowledgeGraph(text, maxEntities);
      return send({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: JSON.stringify(graph, null, 2)
            }
          ]
        }
      });
    } catch (err) {
      return sendError(id, err.message);
    }
  }

  return sendError(id, `Method not supported: ${method}`, -32601);
}

function parseMessages(chunk) {
  buffer += chunk.toString('utf8');
  while (true) {
    const headerIndex = buffer.indexOf('\r\n\r\n');
    if (headerIndex === -1) return;

    const headerText = buffer.slice(0, headerIndex);
    const contentLengthMatch = headerText.match(/Content-Length:\s*(\d+)/i);
    if (!contentLengthMatch) {
      buffer = buffer.slice(headerIndex + 4);
      continue;
    }

    const contentLength = Number(contentLengthMatch[1]);
    const messageStart = headerIndex + 4;
    const messageEnd = messageStart + contentLength;
    if (buffer.length < messageEnd) return;

    const rawMessage = buffer.slice(messageStart, messageEnd);
    buffer = buffer.slice(messageEnd);

    try {
      const parsed = JSON.parse(rawMessage);
      handleMessage(parsed);
    } catch (err) {
      process.stderr.write(`Failed to parse message: ${err.message}\n`);
    }
  }
}

process.stdin.on('data', parseMessages);
process.stdin.on('end', () => process.exit(0));
