# n8n-nodes-lightrag

Custom node for [n8n](https://n8n.io) that allows you to query a LightRAG API and use the results in workflows or AI chatflows.

## Features

- Query LightRAG API with custom options
- Use as a Tool in AI Agents (e.g., ChatGPT Agent in n8n)
- Customize response mode and structure
- Supports top-k filtering, reranking and token limits

## Installation

If you're using a local or Docker-based n8n instance:

Install de package in n8n ui settings

Then, in your n8n .env or Docker env:

N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true