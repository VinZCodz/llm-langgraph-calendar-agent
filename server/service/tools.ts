import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";

const searchTool = new TavilySearch({
    maxResults: 3,
    topic: "general",
});

export const availableTools = [
    searchTool
];