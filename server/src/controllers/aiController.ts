// // import { Request, Response } from "express";
// // import Problem from "../models/Problem";

// // // ========================================
// // // AI PROBLEM GENERATOR
// // // LeetCode + Codeforces real API + Groq Llama 3.3 70b
// // // ========================================

// // const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// // const getGroqKey = () => process.env.GROQ_API_KEY || "";

// // interface PlatformProblem {
// //   title: string;
// //   description: string;
// //   examples: { input: string; output: string; explanation: string }[];
// //   difficulty: string;
// //   tags: string[];
// //   problemId: string;
// // }

// // // ========================================
// // // HTML DECODER UTILITY
// // // ========================================
// // const decodeHtml = (str: string): string => {
// //   return str
// //     .replace(/&quot;/g, '"')
// //     .replace(/&amp;/g, '&')
// //     .replace(/&lt;/g, '<')
// //     .replace(/&gt;/g, '>')
// //     .replace(/&nbsp;/g, ' ')
// //     .replace(/&#39;/g, "'")
// //     .replace(/&apos;/g, "'")
// //     .replace(/<[^>]*>/g, ' ')
// //     .replace(/\s+/g, ' ')
// //     .trim();
// // };

// // // ========================================
// // // LEETCODE FETCHER
// // // ========================================
// // const fetchLeetCodeProblem = async (titleSlug: string): Promise<PlatformProblem> => {
// //   const slug = titleSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

// //   const query = `
// //     query getProblem($titleSlug: String!) {
// //       question(titleSlug: $titleSlug) {
// //         title
// //         titleSlug
// //         difficulty
// //         content
// //         topicTags { name }
// //         exampleTestcaseList
// //       }
// //     }
// //   `;

// //   const response = await fetch("https://leetcode.com/graphql", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
// //     body: JSON.stringify({ query, variables: { titleSlug: slug } }),
// //   });

// //   if (!response.ok) throw new Error(`LeetCode API error: ${response.statusText}`);

// //   const data = await response.json() as any;
// //   const q = data?.data?.question;

// //   if (!q) throw new Error(`Problem "${titleSlug}" not found on LeetCode. Check the problem name/slug.`);

// //   // Clean description — decode HTML entities properly
// //   const description = q.content
// //     ? decodeHtml(q.content).substring(0, 600)
// //     : "Description not available";

// //   // Parse examples — also decode HTML entities in input/output
// //   const examples: { input: string; output: string; explanation: string }[] = [];
// //   const rawContent = q.content || "";
// //   const exampleMatches = rawContent.match(/Input:.*?(?=Input:|Constraints:|$)/gs) || [];

// //   exampleMatches.slice(0, 2).forEach((match: string) => {
// //     const inputMatch = match.match(/Input:\s*([^\n<]+)/);
// //     const outputMatch = match.match(/Output:\s*([^\n<]+)/);
// //     const explanationMatch = match.match(/Explanation:\s*([^\n<]+)/);
// //     if (inputMatch && outputMatch) {
// //       examples.push({
// //         input: decodeHtml(inputMatch[1].trim()),
// //         output: decodeHtml(outputMatch[1].trim()),
// //         explanation: explanationMatch
// //           ? decodeHtml(explanationMatch[1].trim())
// //           : "See problem description for details.",
// //       });
// //     }
// //   });

// //   // Fallback
// //   if (examples.length === 0 && q.exampleTestcaseList?.length > 0) {
// //     examples.push({
// //       input: q.exampleTestcaseList[0],
// //       output: "See problem description",
// //       explanation: "See problem description for details.",
// //     });
// //   }

// //   return {
// //     title: q.title,
// //     description,
// //     examples: examples.length > 0 ? examples : [{
// //       input: "See problem description",
// //       output: "See problem description",
// //       explanation: "Please refer to the full problem description.",
// //     }],
// //     difficulty: q.difficulty || "Medium",
// //     tags: (q.topicTags || []).map((t: any) => t.name),
// //     problemId: q.titleSlug || slug,
// //   };
// // };

// // // ========================================
// // // CODEFORCES FETCHER — scrapes real problem page
// // // ========================================
// // const fetchCodeforcesProblem = async (contestId: string, problemIndex: string): Promise<PlatformProblem> => {
// //   const url = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;

// //   // Step 1: Get metadata from API
// //   const apiRes = await fetch(`https://codeforces.com/api/problemset.problems`);
// //   const apiData = await apiRes.json() as any;
// //   const problem = apiData?.result?.problems?.find(
// //     (p: any) =>
// //       p.contestId?.toString() === contestId &&
// //       p.index?.toUpperCase() === problemIndex.toUpperCase()
// //   );

// //   // Step 2: Scrape actual problem page for description + examples
// //   let description = "";
// //   let examples: { input: string; output: string; explanation: string }[] = [];
// //   let title = problem?.name || `Codeforces ${contestId}${problemIndex}`;

// //   try {
// //     const pageRes = await fetch(url, {
// //       headers: {
// //         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
// //         "Accept": "text/html",
// //       },
// //     });

// //     if (pageRes.ok) {
// //       const html = await pageRes.text();

// //       // Extract problem title
// //       const titleMatch = html.match(/<div class="title">([^<]+)<\/div>/);
// //       if (titleMatch) title = titleMatch[1].replace(/^[A-Z]\.\s*/, "").trim();

// //       // Extract problem statement
// //       const statementMatch = html.match(/<div class="problem-statement">([\s\S]*?)<div class="input-specification">/);
// //       if (statementMatch) {
// //         description = statementMatch[1]
// //           .replace(/<[^>]*>/g, " ")
// //           .replace(/\s+/g, " ")
// //           .trim()
// //           .substring(0, 600);
// //       }

// //       // Extract input/output spec
// //       const inputSpecMatch = html.match(/<div class="input-specification">([\s\S]*?)<\/div>/);
// //       const outputSpecMatch = html.match(/<div class="output-specification">([\s\S]*?)<\/div>/);

// //       const inputSpec = inputSpecMatch
// //         ? inputSpecMatch[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 200)
// //         : "";
// //       const outputSpec = outputSpecMatch
// //         ? outputSpecMatch[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 200)
// //         : "";

// //       if (description && inputSpec) {
// //         description = `${description} Input: ${inputSpec} Output: ${outputSpec}`.substring(0, 700);
// //       }

// //       // Extract sample input/output
// //       const sampleInputs = html.match(/<div class="input">[\s\S]*?<pre>([\s\S]*?)<\/pre>/g) || [];
// //       const sampleOutputs = html.match(/<div class="output">[\s\S]*?<pre>([\s\S]*?)<\/pre>/g) || [];

// //       sampleInputs.slice(0, 2).forEach((inp, i) => {
// //         const inputVal = inp.replace(/<[^>]*>/g, "").trim().substring(0, 150);
// //         const outputVal = sampleOutputs[i]
// //           ? sampleOutputs[i].replace(/<[^>]*>/g, "").trim().substring(0, 80)
// //           : "See problem";
// //         examples.push({
// //           input: inputVal,
// //           output: outputVal,
// //           explanation: "See problem statement for full details.",
// //         });
// //       });
// //     }
// //   } catch (scrapeErr) {
// //     console.warn("Codeforces scrape failed, using API data only:", scrapeErr);
// //   }

// //   // Fallback if scraping failed
// //   if (!description) {
// //     description = `${title}. Tags: ${problem?.tags?.join(", ") || "none"}. Rating: ${problem?.rating || "Unrated"}. Visit ${url}`;
// //   }
// //   if (examples.length === 0) {
// //     examples = [{ input: "See problem page", output: "See problem page", explanation: `Full problem at ${url}` }];
// //   }

// //   const difficulty = problem?.rating
// //     ? (problem.rating <= 1200 ? "Easy" : problem.rating <= 1800 ? "Medium" : "Hard")
// //     : "Medium";

// //   return {
// //     title,
// //     description,
// //     examples,
// //     difficulty,
// //     tags: (problem?.tags || []).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)),
// //     problemId: `cf-${contestId}-${problemIndex.toLowerCase()}`,
// //   };
// // };

// // // ========================================
// // // SYSTEM PROMPT
// // // ========================================
// // const buildSystemPrompt = () => `You are an expert DSA educator generating JSON data for a 3D algorithm visualizer called Plenum.

// // RULES:
// // 1. Return ONLY valid JSON. No markdown, no backticks. Start with { end with }.
// // 2. "problemId" must be lowercase kebab-case.
// // 3. "difficulty" must be exactly "Easy", "Medium", or "Hard".
// // 4. Generate exactly 5 tutorial frames and 8 solution frames.
// // 5. Every frame MUST have scene3D with camera, objects array, and lights array.
// // 6. scene3D objects types: "array", "hashmap-container", "connection-arc", "connection-line", "result-box", "text-3d", "result-display", "complexity-card", "pointer", "stack", "queue", "tree-node", "graph-node".
// // 7. Solutions must include Python, JavaScript, C++, Java.
// // 8. Make scene3D objects VISUALLY DESCRIPTIVE — show actual data values, pointer positions, comparisons happening at each step. Each frame should clearly show what's changing.

// // SCENE3D EXAMPLES (use these patterns):
// // - Array with pointer: {"type":"array","values":[2,7,11,15],"positions":[[-6,0,0],[-2,0,0],[2,0,0],[6,0,0]],"highlights":[0],"highlightColor":"#f59e0b","pointerAt":0}
// // - Hashmap: {"type":"hashmap-container","position":[5,0,0],"contents":[{"key":2,"value":0,"highlighted":true}]}
// // - Connection arc: {"type":"connection-arc","from":[-6,0,0],"to":[-2,0,0],"height":3,"color":"#22c55e","label":"2+7=9"}
// // - Result: {"type":"result-box","position":[0,-3,0],"content":"[0,1]","color":"#22c55e","animation":"pop-in"}
// // - Text label: {"type":"text-3d","text":"target=9","position":[0,3,0],"color":"#a855f7","size":0.6}
// // - Pointer: {"type":"pointer","position":[-6,2,0],"label":"i=0","color":"#3b82f6"}

// // JSON SCHEMA:
// // {
// //   "problemId": "string",
// //   "title": "string",
// //   "difficulty": "Easy|Medium|Hard",
// //   "tags": ["string"],
// //   "description": "string",
// //   "examples": [{"input":"string","output":"string","explanation":"string"}],
// //   "algorithmsRequired": ["string"],
// //   "solutions": {"Python":"code","JavaScript":"code","C++":"code","Java":"code"},
// //   "complexity": {"time":"O(n)","space":"O(n)","explanation":"string"},
// //   "algorithmTutorial": {
// //     "algorithmId": "string",
// //     "algorithmName": "string",
// //     "description": "string",
// //     "frames": [{
// //       "frameNumber": 1,
// //       "title": "string",
// //       "explanation": "2-3 beginner-friendly sentences",
// //       "code": "optional snippet",
// //       "duration": 3,
// //       "scene3D": {
// //         "camera": {"position":[0,5,15],"lookAt":[0,0,0]},
// //         "objects": [],
// //         "lights": [{"type":"ambient","intensity":0.6},{"type":"point","position":[0,10,5],"intensity":1.5}]
// //       }
// //     }]
// //   },
// //   "problemSolution": {
// //     "testCase": {"input":{},"expectedOutput":{}},
// //     "frames": [{"frameNumber":1,"title":"string","explanation":"string","code":"string","duration":3,"scene3D":{"camera":{"position":[0,5,15]},"objects":[],"lights":[{"type":"ambient","intensity":0.6}]}}]
// //   }
// // }`;

// // // ========================================
// // // GROQ CALLER
// // // ========================================
// // const callGroq = async (systemPrompt: string, userPrompt: string): Promise<string> => {
// //   const response = await fetch(GROQ_URL, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //       "Authorization": `Bearer ${getGroqKey()}`,
// //     },
// //     body: JSON.stringify({
// //       model: "llama-3.3-70b-versatile",
// //       messages: [
// //         { role: "system", content: systemPrompt },
// //         { role: "user", content: userPrompt },
// //       ],
// //       temperature: 0.2,
// //       max_tokens: 7000,
// //       response_format: { type: "json_object" },
// //     }),
// //   });

// //   if (!response.ok) {
// //     const errorData = await response.json().catch(() => ({})) as any;
// //     throw new Error(`Groq API error: ${errorData?.error?.message || response.statusText}`);
// //   }

// //   const data = await response.json() as any;
// //   const rawText = data?.choices?.[0]?.message?.content;
// //   if (!rawText) throw new Error("Groq returned empty response.");

// //   return rawText
// //     .replace(/^```json\s*/i, "")
// //     .replace(/^```\s*/i, "")
// //     .replace(/\s*```$/i, "")
// //     .trim();
// // };

// // // ========================================
// // // GENERATE + SAVE
// // // POST /api/ai/generate
// // // ========================================
// // export const generateProblem = async (req: Request, res: Response) => {
// //   try {
// //     const { platform, problemNumber, problemName } = req.body;

// //     // Validate — for LeetCode and Codeforces, problemNumber is enough
// //     const hasIdentifier = (problemNumber && problemNumber.trim()) || (problemName && problemName.trim());
// //     if (!hasIdentifier) {
// //       return res.status(400).json({
// //         success: false,
// //         message: "Please provide a problem number or name.",
// //       });
// //     }

// //     if (!getGroqKey()) {
// //       return res.status(503).json({
// //         success: false,
// //         message: "Groq API key not configured. Add GROQ_API_KEY to server/.env",
// //         hint: "Get free key at https://console.groq.com",
// //       });
// //     }

// //     const displayName = problemName || problemNumber;
// //     console.log(`🤖 Generating "${displayName}" from ${platform}...`);

// //     // ── Step 1: Fetch from platform ──
// //     let platformData: PlatformProblem | null = null;
// //     let fetchError = "";

// //     try {
// //       if (platform === "leetcode") {
// //         console.log(`📡 Fetching from LeetCode API...`);
// //         // Use problemNumber as slug if no name, or convert name to slug
// //         const slug = (problemName || problemNumber || "")
// //           .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
// //         platformData = await fetchLeetCodeProblem(slug);
// //         console.log(`✅ LeetCode data fetched: "${platformData.title}"`);

// //       } else if (platform === "codeforces") {
// //         console.log(`📡 Fetching from Codeforces API...`);
// //         let contestId = "";
// //         let problemIndex = "A";

// //         // Parse formats: "2211A", "2211" + name "A", or number "2211" alone (default A)
// //         const combined = (problemNumber || "").trim();
// //         const cfMatch = combined.match(/^(\d+)([A-Za-z]\d*)$/);

// //         if (cfMatch) {
// //           // e.g. "2211A"
// //           contestId = cfMatch[1];
// //           problemIndex = cfMatch[2];
// //         } else if (/^\d+$/.test(combined)) {
// //           // Just contest ID — check if problemName has the index
// //           contestId = combined;
// //           const nameAsIndex = (problemName || "").trim().match(/^([A-Za-z]\d*)$/);
// //           problemIndex = nameAsIndex ? nameAsIndex[1] : "A";
// //         } else {
// //           throw new Error('For Codeforces: enter "2211A" or "2211" in Problem Number field and "A" in Problem Name.');
// //         }

// //         platformData = await fetchCodeforcesProblem(contestId, problemIndex);
// //         console.log(`✅ Codeforces data fetched: "${platformData.title}"`);
// //       }
// //     } catch (err) {
// //       fetchError = err instanceof Error ? err.message : "Platform fetch failed";
// //       console.warn(`⚠️ ${fetchError} — using AI knowledge`);
// //     }

// //     // ── Step 2: Build prompt ──
// //     let userPrompt = "";

// //     if (platformData) {
// //       userPrompt = `Generate Plenum visualizer data for this ${platform} problem:

// // Title: ${platformData.title}
// // Problem ID: ${platformData.problemId}
// // Difficulty: ${platformData.difficulty}
// // Tags: ${platformData.tags.slice(0, 5).join(", ")}

// // Description:
// // ${platformData.description.substring(0, 600)}

// // Examples:
// // ${JSON.stringify(platformData.examples.slice(0, 2).map(ex => ({
// //   input: ex.input.substring(0, 150),
// //   output: ex.output.substring(0, 80),
// //   explanation: (ex.explanation || "See description.").substring(0, 150),
// // })))}

// // Use EXACTLY:
// // - problemId: "${platformData.problemId}"
// // - title: "${platformData.title}"
// // - difficulty: "${platformData.difficulty}"
// // - tags: ${JSON.stringify(platformData.tags.slice(0, 5))}

// // Generate rich 3D visualizations showing the algorithm step by step with actual data values visible in each frame.`;

// //     } else {
// //       userPrompt = `Generate Plenum visualizer data for:
// // Problem: ${problemName || problemNumber}
// // Platform: ${platform}
// // ${fetchError ? `Note: ${fetchError} — use your knowledge of this problem.` : ""}

// // Generate rich 3D visualizations showing the algorithm step by step with actual data values.`;
// //     }

// //     // ── Step 3: Call Groq ──
// //     let rawContent: string;
// //     try {
// //       rawContent = await callGroq(buildSystemPrompt(), userPrompt);
// //     } catch (apiError) {
// //       console.error("Groq failed:", apiError);
// //       return res.status(502).json({
// //         success: false,
// //         message: apiError instanceof Error ? apiError.message : "Groq API call failed.",
// //       });
// //     }

// //     // ── Step 4: Parse ──
// //     let problemData: any;
// //     try {
// //       problemData = JSON.parse(rawContent);
// //     } catch {
// //       return res.status(502).json({ success: false, message: "AI returned invalid JSON. Please try again." });
// //     }

// //     // ── Step 5: Override with real platform data ──
// //     if (platformData) {
// //       problemData.title = platformData.title;
// //       problemData.description = platformData.description;
// //       problemData.difficulty = platformData.difficulty;
// //       problemData.tags = platformData.tags.length > 0 ? platformData.tags : problemData.tags;
// //       problemData.problemId = platformData.problemId;
// //       // Use platform examples but ensure explanation is never empty
// //       problemData.examples = platformData.examples.map((ex: any) => ({
// //         ...ex,
// //         explanation: ex.explanation?.trim() || "See problem description for details.",
// //       }));
// //     }

// //     // ── Step 6: Validate ──
// //     const required = ["problemId", "title", "difficulty", "description", "examples", "solutions", "complexity", "algorithmTutorial", "problemSolution"];
// //     const missing = required.filter(f => !problemData[f]);
// //     if (missing.length > 0) {
// //       return res.status(502).json({ success: false, message: `AI missing fields: ${missing.join(", ")}. Try again.` });
// //     }

// //     // ── Step 7: Sanitize all examples ──
// //     if (Array.isArray(problemData.examples)) {
// //       problemData.examples = problemData.examples.map((ex: any) => ({
// //         input: ex.input || "See problem",
// //         output: ex.output || "See problem",
// //         explanation: ex.explanation?.trim() || "See problem description for details.",
// //       }));
// //     }

// //     // ── Step 8: Check duplicate ──
// //     const existing = await Problem.findOne({ problemId: problemData.problemId });
// //     if (existing) {
// //       return res.status(409).json({
// //         success: false,
// //         message: `"${problemData.title}" already exists in the database.`,
// //         existingId: problemData.problemId,
// //       });
// //     }

// //     // ── Step 9: Save ──
// //     const saved = await Problem.create(problemData);
// //     console.log(`✅ "${saved.title}" saved! Tutorial: ${saved.algorithmTutorial?.frames?.length} frames, Solution: ${saved.problemSolution?.frames?.length} frames`);

// //     return res.status(201).json({
// //       success: true,
// //       message: `"${saved.title}" generated and saved!`,
// //       data: {
// //         problemId: saved.problemId,
// //         title: saved.title,
// //         difficulty: saved.difficulty,
// //         tags: saved.tags,
// //         tutorialFrames: saved.algorithmTutorial?.frames?.length,
// //         solutionFrames: saved.problemSolution?.frames?.length,
// //         languages: Object.keys(saved.solutions || {}),
// //         source: platformData ? `Fetched from ${platform}` : "AI generated",
// //       },
// //     });

// //   } catch (error) {
// //     console.error("Error:", error);
// //     return res.status(500).json({
// //       success: false,
// //       message: "Internal server error.",
// //       error: error instanceof Error ? error.message : "Unknown error",
// //     });
// //   }
// // };

// // // ========================================
// // // PREVIEW (don't save)
// // // POST /api/ai/preview
// // // ========================================
// // export const previewProblem = async (req: Request, res: Response) => {
// //   try {
// //     const { platform, problemNumber, problemName } = req.body;
// //     if (!problemName && !problemNumber) {
// //       return res.status(400).json({ success: false, message: "Problem name or number required" });
// //     }
// //     const userPrompt = `Generate Plenum data for: ${problemName || problemNumber} (${platform})`;
// //     const rawContent = await callGroq(buildSystemPrompt(), userPrompt);
// //     const problemData = JSON.parse(rawContent);
// //     return res.json({ success: true, message: "Preview generated", data: problemData });
// //   } catch (error) {
// //     return res.status(500).json({ success: false, message: "Preview failed", error: error instanceof Error ? error.message : "Unknown" });
// //   }
// // };

// import { Request, Response } from "express";
// import Problem from "../models/Problem";

// const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// const getGroqKey = () => process.env.GROQ_API_KEY || "";

// interface PlatformProblem {
//   title: string;
//   description: string;
//   examples: { input: string; output: string; explanation: string }[];
//   difficulty: string;
//   tags: string[];
//   problemId: string;
// }

// // ── HTML decoder ──
// const decodeHtml = (str: string): string =>
//   str
//     .replace(/&quot;/g, '"')
//     .replace(/&amp;/g, "&")
//     .replace(/&lt;/g, "<")
//     .replace(/&gt;/g, ">")
//     .replace(/&nbsp;/g, " ")
//     .replace(/&#39;/g, "'")
//     .replace(/<[^>]*>/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();

// // ========================================
// // LEETCODE FETCHER
// // ========================================
// const fetchLeetCodeProblem = async (titleSlug: string): Promise<PlatformProblem> => {
//   const slug = titleSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

//   const query = `query getProblem($titleSlug: String!) {
//     question(titleSlug: $titleSlug) {
//       title titleSlug difficulty content
//       topicTags { name }
//       exampleTestcaseList
//     }
//   }`;

//   const response = await fetch("https://leetcode.com/graphql", {
//     method: "POST",
//     headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
//     body: JSON.stringify({ query, variables: { titleSlug: slug } }),
//   });

//   if (!response.ok) throw new Error(`LeetCode API error: ${response.statusText}`);
//   const data = await response.json() as any;
//   const q = data?.data?.question;
//   if (!q) throw new Error(`Problem "${titleSlug}" not found on LeetCode.`);

//   const rawHtml = q.content || "";

//   // Extract problem statement only (before first example)
//   const splitPoint = rawHtml.indexOf('<strong class="example">');
//   const statementHtml = splitPoint > 0 ? rawHtml.substring(0, splitPoint) : rawHtml;
//   let description = decodeHtml(statementHtml).substring(0, 800);

//   // Extract examples using split on example markers
//   const examples: { input: string; output: string; explanation: string }[] = [];
//   const exampleParts = rawHtml.split('<strong class="example">').slice(1);

//   exampleParts.slice(0, 3).forEach((part: string) => {
//     const preMatch = part.match(/<pre>([\s\S]*?)<\/pre>/);
//     if (preMatch) {
//       const text = decodeHtml(preMatch[1]);
//       const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
//       let input = "";
//       let output = "";
//       let explanation = "";
//       lines.forEach((line: string) => {
//         if (line.startsWith("Input:")) input = line.replace("Input:", "").trim();
//         else if (line.startsWith("Output:")) output = line.replace("Output:", "").trim();
//         else if (line.startsWith("Explanation:")) explanation = line.replace("Explanation:", "").trim();
//       });
//       if (input && output) {
//         examples.push({
//           input,
//           output,
//           explanation: explanation || "See problem description for details.",
//         });
//       }
//     }
//   });

//   // Extract constraints
//   const constraintsIdx = rawHtml.indexOf("Constraints");
//   if (constraintsIdx > 0) {
//     const constraintsHtml = rawHtml.substring(constraintsIdx, constraintsIdx + 600);
//     const cleaned = decodeHtml(constraintsHtml)
//       .replace(/^Constraints[:\s]*/i, "")
//       .trim()
//       .substring(0, 300);
//     if (cleaned) {
//       description = description + "\n\nConstraints:\n" + cleaned;
//     }
//   }

//   // Fallback
//   if (examples.length === 0 && q.exampleTestcaseList?.length > 0) {
//     examples.push({
//       input: q.exampleTestcaseList[0],
//       output: "See problem description",
//       explanation: "See problem description for details.",
//     });
//   }

//   return {
//     title: q.title,
//     description,
//     examples: examples.length > 0 ? examples : [{
//       input: "See problem description",
//       output: "See problem description",
//       explanation: "Please refer to the full problem description.",
//     }],
//     difficulty: q.difficulty || "Medium",
//     tags: (q.topicTags || []).map((t: any) => t.name),
//     problemId: q.titleSlug || slug,
//   };
// };

// // ========================================
// // CODEFORCES FETCHER — scrapes real problem page
// // ========================================
// const fetchCodeforcesProblem = async (contestId: string, problemIndex: string): Promise<PlatformProblem> => {
//   const url = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;

//   // Get metadata from API
//   const apiRes = await fetch("https://codeforces.com/api/problemset.problems");
//   const apiData = await apiRes.json() as any;
//   const problem = apiData?.result?.problems?.find(
//     (p: any) =>
//       p.contestId?.toString() === contestId &&
//       p.index?.toUpperCase() === problemIndex.toUpperCase()
//   );

//   let title = problem?.name || `Codeforces ${contestId}${problemIndex}`;
//   let description = "";
//   let examples: { input: string; output: string; explanation: string }[] = [];

//   // Scrape actual problem page
//   try {
//     const pageRes = await fetch(url, {
//       headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
//     });

//     if (pageRes.ok) {
//       const html = await pageRes.text();

//       // Extract title
//       const titleMatch = html.match(/<div class="title">([^<]+)<\/div>/);
//       if (titleMatch) title = titleMatch[1].replace(/^[A-Z]+\d*\.\s*/, "").trim();

//       // Extract problem statement (between .header and input-specification)
//       const stmtStart = html.indexOf('class="header"');
//       const stmtEnd = html.indexOf('class="input-specification"');
//       if (stmtStart > 0 && stmtEnd > stmtStart) {
//         const stmtHtml = html.substring(stmtStart, stmtEnd);
//         description = decodeHtml(stmtHtml)
//           .replace(/time limit.*?memory limit.*?megabytes/gi, "")
//           .trim()
//           .substring(0, 600);
//       }

//       // Extract input/output spec
//       const inputEnd = html.indexOf('class="output-specification"');
//       if (stmtEnd > 0 && inputEnd > stmtEnd) {
//         const inputHtml = html.substring(stmtEnd, inputEnd);
//         const inputText = decodeHtml(inputHtml).replace(/^Input\s*/i, "").trim().substring(0, 200);

//         const outputStart = inputEnd;
//         const sampleStart = html.indexOf('class="sample-tests"');
//         const outputEnd = sampleStart > 0 ? sampleStart : outputStart + 500;
//         const outputHtml = html.substring(outputStart, outputEnd);
//         const outputText = decodeHtml(outputHtml).replace(/^Output\s*/i, "").trim().substring(0, 200);

//         if (inputText) {
//           description = description + "\n\nInput: " + inputText;
//         }
//         if (outputText) {
//           description = description + "\n\nOutput: " + outputText;
//         }
//       }

//       // Extract sample tests
//       const sampleTestsMatch = html.match(/class="sample-tests"([\s\S]*?)(?=class="note"|<\/div>\s*<\/div>\s*<\/div>|$)/);
//       if (sampleTestsMatch) {
//         const samplesHtml = sampleTestsMatch[1];
//         const inputs = samplesHtml.match(/class="input"[\s\S]*?<pre>([\s\S]*?)<\/pre>/g) || [];
//         const outputs = samplesHtml.match(/class="output"[\s\S]*?<pre>([\s\S]*?)<\/pre>/g) || [];

//         inputs.slice(0, 2).forEach((inp: string, i: number) => {
//           const inPreMatch = inp.match(/<pre>([\s\S]*?)<\/pre>/);
//           const outPreMatch = outputs[i] ? outputs[i].match(/<pre>([\s\S]*?)<\/pre>/) : null;
//           if (inPreMatch) {
//             examples.push({
//               input: decodeHtml(inPreMatch[1]).trim().substring(0, 150),
//               output: outPreMatch ? decodeHtml(outPreMatch[1]).trim().substring(0, 80) : "See problem",
//               explanation: "See problem statement for full details.",
//             });
//           }
//         });
//       }
//     }
//   } catch (err) {
//     console.warn("CF scrape failed:", err);
//   }

//   if (!description) {
//     description = `${title}. Tags: ${problem?.tags?.join(", ") || "none"}. Rating: ${problem?.rating || "Unrated"}. Visit ${url}`;
//   }
//   if (examples.length === 0) {
//     examples = [{ input: "See problem page", output: "See problem page", explanation: `Full problem at ${url}` }];
//   }

//   const difficulty = problem?.rating
//     ? problem.rating <= 1200 ? "Easy" : problem.rating <= 1800 ? "Medium" : "Hard"
//     : "Medium";

//   return {
//     title,
//     description,
//     examples,
//     difficulty,
//     tags: (problem?.tags || []).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)),
//     problemId: `cf-${contestId}-${problemIndex.toLowerCase()}`,
//   };
// };

// // ========================================
// // CLEAN PLATFORM DATA VIA GROQ
// // ========================================
// const cleanPlatformData = async (rawData: PlatformProblem): Promise<PlatformProblem> => {
//   const cleanPrompt = `You are a text cleaner for a DSA visualizer. Clean this raw problem data.

// Raw description: ${rawData.description.substring(0, 600)}
// Raw examples: ${JSON.stringify(rawData.examples.slice(0, 2))}

// Return ONLY valid JSON:
// {
//   "description": "clean problem statement in plain English only, no LaTeX, no $$, no HTML. Keep constraints if present.",
//   "examples": [
//     { "input": "clean formatted input e.g. nums = [2,7,11,15], target = 9", "output": "clean output e.g. [0,1]", "explanation": "clear English explanation" }
//   ]
// }

// Rules: Remove dollar signs, LaTeX, HTML entities. Format example inputs like: key = value. Keep it concise.`;

//   try {
//     const raw = await callGroq("You are a precise text cleaner. Return only valid JSON.", cleanPrompt);
//     const cleaned = JSON.parse(raw);
//     return {
//       ...rawData,
//       description: cleaned.description || rawData.description,
//       examples: cleaned.examples?.length > 0 ? cleaned.examples : rawData.examples,
//     };
//   } catch {
//     return rawData;
//   }
// };

// // ========================================
// // SYSTEM PROMPT
// // ========================================
// const buildSystemPrompt = () => `You are an expert DSA educator generating JSON for a 3D algorithm visualizer called Plenum.

// RULES:
// 1. Return ONLY valid JSON. No markdown, no backticks. Start { end }.
// 2. problemId = lowercase kebab-case.
// 3. difficulty = exactly "Easy", "Medium", or "Hard".
// 4. Generate exactly 5 tutorial frames and 8 solution frames.
// 5. Every frame MUST have scene3D with camera, objects array, lights array.
// 6. Make scene3D VISUALLY DESCRIPTIVE — show actual data values, pointer positions at each step.
// 7. Solutions: Python, JavaScript, C++, Java.

// SCENE3D OBJECT TYPES:
// - array: {"type":"array","values":[2,7,11,15],"positions":[[-6,0,0],[-2,0,0],[2,0,0],[6,0,0]],"highlights":[0],"highlightColor":"#f59e0b","pointerAt":0}
// - hashmap-container: {"type":"hashmap-container","position":[5,0,0],"contents":[{"key":2,"value":0,"highlighted":true}]}
// - pointer: {"type":"pointer","position":[-6,2,0],"label":"i=0","color":"#3b82f6"}
// - connection-arc: {"type":"connection-arc","from":[-6,0,0],"to":[-2,0,0],"height":3,"color":"#22c55e","label":"sum=9"}
// - result-box: {"type":"result-box","position":[0,-3,0],"content":"[0,1]","color":"#22c55e","animation":"pop-in"}
// - text-3d: {"type":"text-3d","text":"target=9","position":[0,4,0],"color":"#a855f7","size":0.6}

// JSON SCHEMA:
// {
//   "problemId":"string","title":"string","difficulty":"Easy","tags":["string"],
//   "description":"string","examples":[{"input":"string","output":"string","explanation":"string"}],
//   "algorithmsRequired":["string"],
//   "solutions":{"Python":"code","JavaScript":"code","C++":"code","Java":"code"},
//   "complexity":{"time":"O(n)","space":"O(n)","explanation":"string"},
//   "algorithmTutorial":{
//     "algorithmId":"string","algorithmName":"string","description":"string",
//     "frames":[{"frameNumber":1,"title":"string","explanation":"string","code":"string","duration":3,
//       "scene3D":{"camera":{"position":[0,5,15],"lookAt":[0,0,0]},"objects":[],"lights":[{"type":"ambient","intensity":0.6},{"type":"point","position":[0,10,5],"intensity":1.5}]}}]
//   },
//   "problemSolution":{
//     "testCase":{"input":{},"expectedOutput":{}},
//     "frames":[{"frameNumber":1,"title":"string","explanation":"string","code":"string","duration":3,
//       "scene3D":{"camera":{"position":[0,5,15]},"objects":[],"lights":[{"type":"ambient","intensity":0.6}]}}]
//   }
// }`;

// // ========================================
// // GROQ CALLER
// // ========================================
// const callGroq = async (systemPrompt: string, userPrompt: string): Promise<string> => {
//   const response = await fetch(GROQ_URL, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getGroqKey()}` },
//     body: JSON.stringify({
//       model: "llama-3.3-70b-versatile",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userPrompt },
//       ],
//       temperature: 0.2,
//       max_tokens: 7000,
//       response_format: { type: "json_object" },
//     }),
//   });

//   if (!response.ok) {
//     const err = await response.json().catch(() => ({})) as any;
//     throw new Error(`Groq API error: ${err?.error?.message || response.statusText}`);
//   }

//   const data = await response.json() as any;
//   const rawText = data?.choices?.[0]?.message?.content;
//   if (!rawText) throw new Error("Groq returned empty response.");

//   return rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
// };

// // ========================================
// // GENERATE + SAVE — POST /api/ai/generate
// // ========================================
// export const generateProblem = async (req: Request, res: Response) => {
//   try {
//     const { platform, problemNumber, problemName } = req.body;

//     const hasIdentifier = (problemNumber && problemNumber.trim()) || (problemName && problemName.trim());
//     if (!hasIdentifier) {
//       return res.status(400).json({ success: false, message: "Please provide a problem number or name." });
//     }

//     if (!getGroqKey()) {
//       return res.status(503).json({
//         success: false,
//         message: "Groq API key not configured. Add GROQ_API_KEY to server/.env",
//         hint: "Get free key at https://console.groq.com",
//       });
//     }

//     console.log(`🤖 Generating "${problemName || problemNumber}" from ${platform}...`);

//     // ── Step 1: Fetch from platform ──
//     let platformData: PlatformProblem | null = null;
//     let fetchError = "";

//     try {
//       if (platform === "leetcode") {
//         console.log("📡 Fetching from LeetCode API...");
//         const slug = (problemName || problemNumber || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
//         platformData = await fetchLeetCodeProblem(slug);
//         console.log(`✅ LeetCode fetched: "${platformData.title}"`);

//       } else if (platform === "codeforces") {
//         console.log("📡 Fetching from Codeforces...");
//         let contestId = "";
//         let problemIndex = "A";
//         const combined = (problemNumber || "").trim();
//         const cfMatch = combined.match(/^(\d+)([A-Za-z]\d*)$/);
//         if (cfMatch) {
//           contestId = cfMatch[1];
//           problemIndex = cfMatch[2];
//         } else if (/^\d+$/.test(combined)) {
//           contestId = combined;
//           const nameAsIndex = (problemName || "").trim().match(/^([A-Za-z]\d*)$/);
//           problemIndex = nameAsIndex ? nameAsIndex[1] : "A";
//         } else {
//           throw new Error('For Codeforces: enter "2211A" in Problem Number, or "2211" + "A" in Problem Name.');
//         }
//         platformData = await fetchCodeforcesProblem(contestId, problemIndex);
//         console.log(`✅ Codeforces fetched: "${platformData.title}"`);
//       }
//     } catch (err) {
//       fetchError = err instanceof Error ? err.message : "Platform fetch failed";
//       console.warn(`⚠️ ${fetchError}`);
//     }

//     // ── Step 2: Clean platform data ──
//     if (platformData) {
//       console.log("🧹 Cleaning platform data...");
//       try {
//         platformData = await cleanPlatformData(platformData);
//         console.log("✅ Data cleaned");
//       } catch {
//         console.warn("⚠️ Cleaning failed, using raw data");
//       }
//     }

//     // ── Step 3: Build prompt ──
//     let userPrompt = "";
//     if (platformData) {
//       userPrompt = `Generate Plenum 3D visualizer data for this ${platform} problem:

// Title: ${platformData.title}
// Problem ID: ${platformData.problemId}
// Difficulty: ${platformData.difficulty}
// Tags: ${platformData.tags.slice(0, 5).join(", ")}

// Description:
// ${platformData.description.substring(0, 500)}

// Examples:
// ${JSON.stringify(platformData.examples.slice(0, 2).map(ex => ({
//   input: ex.input.substring(0, 120),
//   output: ex.output.substring(0, 60),
//   explanation: (ex.explanation || "").substring(0, 120),
// })))}

// Use EXACTLY: problemId="${platformData.problemId}", title="${platformData.title}", difficulty="${platformData.difficulty}"
// Generate rich scene3D with actual data values visible at each step.`;
//     } else {
//       userPrompt = `Generate Plenum 3D visualizer data for: ${problemName || problemNumber} (${platform})
// ${fetchError ? `Note: ${fetchError} — use your knowledge.` : ""}
// Generate rich scene3D showing algorithm step by step.`;
//     }

//     // ── Step 4: Call Groq ──
//     let rawContent: string;
//     try {
//       rawContent = await callGroq(buildSystemPrompt(), userPrompt);
//     } catch (apiError) {
//       return res.status(502).json({
//         success: false,
//         message: apiError instanceof Error ? apiError.message : "Groq API call failed.",
//       });
//     }

//     // ── Step 5: Parse ──
//     let problemData: any;
//     try {
//       problemData = JSON.parse(rawContent);
//     } catch {
//       return res.status(502).json({ success: false, message: "AI returned invalid JSON. Please try again." });
//     }

//     // ── Step 6: Override with real platform data ──
//     if (platformData) {
//       problemData.title = platformData.title;
//       problemData.description = platformData.description;
//       problemData.difficulty = platformData.difficulty;
//       problemData.tags = platformData.tags.length > 0 ? platformData.tags : problemData.tags;
//       problemData.problemId = platformData.problemId;
//       problemData.examples = platformData.examples.map((ex: any) => ({
//         ...ex,
//         explanation: ex.explanation?.trim() || "See problem description for details.",
//       }));
//     }

//     // ── Step 7: Validate ──
//     const required = ["problemId", "title", "difficulty", "description", "examples", "solutions", "complexity", "algorithmTutorial", "problemSolution"];
//     const missing = required.filter(f => !problemData[f]);
//     if (missing.length > 0) {
//       return res.status(502).json({ success: false, message: `AI missing fields: ${missing.join(", ")}. Try again.` });
//     }

//     // ── Step 8: Sanitize examples ──
//     if (Array.isArray(problemData.examples)) {
//       problemData.examples = problemData.examples.map((ex: any) => ({
//         input: ex.input || "See problem",
//         output: ex.output || "See problem",
//         explanation: ex.explanation?.trim() || "See problem description for details.",
//       }));
//     }

//     // ── Step 9: Check duplicate ──
//     const existing = await Problem.findOne({ problemId: problemData.problemId });
//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: `"${problemData.title}" already exists in the database.`,
//         existingId: problemData.problemId,
//       });
//     }

//     // ── Step 10: Save ──
//     const saved = await Problem.create(problemData);
//     console.log(`✅ "${saved.title}" saved! Tutorial: ${saved.algorithmTutorial?.frames?.length}, Solution: ${saved.problemSolution?.frames?.length}`);

//     return res.status(201).json({
//       success: true,
//       message: `"${saved.title}" generated and saved!`,
//       data: {
//         problemId: saved.problemId,
//         title: saved.title,
//         difficulty: saved.difficulty,
//         tags: saved.tags,
//         tutorialFrames: saved.algorithmTutorial?.frames?.length,
//         solutionFrames: saved.problemSolution?.frames?.length,
//         languages: Object.keys(saved.solutions || {}),
//         source: platformData ? `Fetched from ${platform}` : "AI generated",
//       },
//     });

//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error.",
//       error: error instanceof Error ? error.message : "Unknown error",
//     });
//   }
// };

// // ========================================
// // PREVIEW — POST /api/ai/preview
// // ========================================
// export const previewProblem = async (req: Request, res: Response) => {
//   try {
//     const { platform, problemNumber, problemName } = req.body;
//     if (!problemName && !problemNumber) {
//       return res.status(400).json({ success: false, message: "Problem name or number required" });
//     }
//     const userPrompt = `Generate Plenum data for: ${problemName || problemNumber} (${platform})`;
//     const rawContent = await callGroq(buildSystemPrompt(), userPrompt);
//     const problemData = JSON.parse(rawContent);
//     return res.json({ success: true, message: "Preview generated", data: problemData });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Preview failed",
//       error: error instanceof Error ? error.message : "Unknown",
//     });
//   }
// };

import { Request, Response } from "express";
import Problem from "../models/Problem";

// const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// const getGroqKey = () => process.env.GROQ_API_KEY || "";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const getGeminiKey = () => process.env.GEMINI_API_KEY || "";

interface PlatformProblem {
  title: string;
  description: string;
  examples: { input: string; output: string; explanation: string }[];
  difficulty: string;
  tags: string[];
  problemId: string;
}

// ── HTML decoder ──
const decodeHtml = (str: string): string =>
  str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// ========================================
// LEETCODE FETCHER
// ========================================
const fetchLeetCodeProblem = async (titleSlug: string): Promise<PlatformProblem> => {
  const slug = titleSlug.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const query = `query getProblem($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title titleSlug difficulty content
      topicTags { name }
      exampleTestcaseList
    }
  }`;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
    body: JSON.stringify({ query, variables: { titleSlug: slug } }),
  });

  if (!response.ok) throw new Error(`LeetCode API error: ${response.statusText}`);
  const data = await response.json() as any;
  const q = data?.data?.question;
  if (!q) throw new Error(`Problem "${titleSlug}" not found on LeetCode.`);

  const rawHtml = q.content || "";

  // Extract problem statement only (before first example)
  const exampleMarkers = ['<strong class="example">', '<b>Example 1</b>', '<b>Example 1:</b>'];
  let splitPoint = -1;
  for (const marker of exampleMarkers) {
    const idx = rawHtml.indexOf(marker);
    if (idx > 0) { splitPoint = idx; break; }
  }
  const statementHtml = splitPoint > 0 ? rawHtml.substring(0, splitPoint) : rawHtml;
  let description = decodeHtml(statementHtml).substring(0, 800);

  // Extract ALL examples — try multiple HTML patterns LeetCode uses
  const examples: { input: string; output: string; explanation: string }[] = [];

  // Pattern 1: <strong class="example"> marker (modern LeetCode)
  let exampleParts = rawHtml.split('<strong class="example">').slice(1);

  // Pattern 2: fallback — split on <pre> blocks directly
  if (exampleParts.length === 0) {
    exampleParts = rawHtml.split(/<b>Example\s*\d+[:.]/i).slice(1);
  }

  exampleParts.slice(0, 5).forEach((part: string) => {
    // Extract the <pre> block
    const preMatch = part.match(/<pre>([\s\S]*?)<\/pre>/);
    if (!preMatch) return;

    const text = decodeHtml(preMatch[1]);
    const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);

    let input = "";
    let output = "";
    let explanation = "";
    let collectingInput = false;
    let collectingExplanation = false;

    lines.forEach((line: string) => {
      if (line.startsWith("Input:")) {
        input = line.replace("Input:", "").trim();
        collectingInput = true;
        collectingExplanation = false;
      } else if (line.startsWith("Output:")) {
        output = line.replace("Output:", "").trim();
        collectingInput = false;
        collectingExplanation = false;
      } else if (line.startsWith("Explanation:")) {
        explanation = line.replace("Explanation:", "").trim();
        collectingInput = false;
        collectingExplanation = true;
      } else if (collectingInput && !line.startsWith("Output:")) {
        // Multi-line input
        input = input + " " + line;
      } else if (collectingExplanation) {
        explanation = explanation + " " + line;
      }
    });

    if (input && output) {
      examples.push({
        input: input.trim(),
        output: output.trim(),
        explanation: explanation.trim() || "See problem description for details.",
      });
    }
  });

  // Extract constraints — look for <ul> after "Constraints" heading
  const constraintsIdx = rawHtml.indexOf("Constraints");
  if (constraintsIdx > 0) {
    // Get everything from Constraints heading to end of its <ul>
    const afterConstraints = rawHtml.substring(constraintsIdx, constraintsIdx + 1500);
    const ulMatch = afterConstraints.match(/<ul>([\s\S]*?)<\/ul>/);
    let constraintText = "";
    if (ulMatch) {
      // Extract each <li> item
      const liMatches = ulMatch[1].match(/<li>([\s\S]*?)<\/li>/g) || [];
      constraintText = liMatches
        .map((li: string) => "• " + decodeHtml(li.replace(/<li>/g, "").replace(/<\/li>/g, "")).trim())
        .join("");
    } else {
      constraintText = decodeHtml(afterConstraints)
        .replace(/^Constraints[:\s]*/i, "")
        .trim()
        .substring(0, 300);
    }
    if (constraintText) {
      description = description + "Constraints:" + constraintText;
    }
  }

  // Fallback
  if (examples.length === 0 && q.exampleTestcaseList?.length > 0) {
    examples.push({
      input: q.exampleTestcaseList[0],
      output: "See problem description",
      explanation: "See problem description for details.",
    });
  }

  return {
    title: q.title,
    description,
    examples: examples.length > 0 ? examples : [{
      input: "See problem description",
      output: "See problem description",
      explanation: "Please refer to the full problem description.",
    }],
    difficulty: q.difficulty || "Medium",
    tags: (q.topicTags || []).map((t: any) => t.name),
    problemId: q.titleSlug || slug,
  };
};

// ========================================
// CODEFORCES FETCHER — scrapes real problem page
// ========================================
const fetchCodeforcesProblem = async (contestId: string, problemIndex: string): Promise<PlatformProblem> => {
  const url = `https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`;

  // Get metadata from API
  const apiRes = await fetch("https://codeforces.com/api/problemset.problems");
  const apiData = await apiRes.json() as any;
  const problem = apiData?.result?.problems?.find(
    (p: any) =>
      p.contestId?.toString() === contestId &&
      p.index?.toUpperCase() === problemIndex.toUpperCase()
  );

  let title = problem?.name || `Codeforces ${contestId}${problemIndex}`;
  let description = "";
  let examples: { input: string; output: string; explanation: string }[] = [];

  // Scrape actual problem page
  try {
    const pageRes = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });

    if (pageRes.ok) {
      const html = await pageRes.text();

      // Extract title
      const titleMatch = html.match(/<div class="title">([^<]+)<\/div>/);
      if (titleMatch) title = titleMatch[1].replace(/^[A-Z]+\d*\.\s*/, "").trim();

      // Extract problem statement (between .header and input-specification)
      const stmtStart = html.indexOf('class="header"');
      const stmtEnd = html.indexOf('class="input-specification"');
      if (stmtStart > 0 && stmtEnd > stmtStart) {
        const stmtHtml = html.substring(stmtStart, stmtEnd);
        description = decodeHtml(stmtHtml)
          .replace(/time limit.*?memory limit.*?megabytes/gi, "")
          .trim()
          .substring(0, 600);
      }

      // Extract input/output spec
      const inputEnd = html.indexOf('class="output-specification"');
      if (stmtEnd > 0 && inputEnd > stmtEnd) {
        const inputHtml = html.substring(stmtEnd, inputEnd);
        const inputText = decodeHtml(inputHtml).replace(/^Input\s*/i, "").trim().substring(0, 200);

        const outputStart = inputEnd;
        const sampleStart = html.indexOf('class="sample-tests"');
        const outputEnd = sampleStart > 0 ? sampleStart : outputStart + 500;
        const outputHtml = html.substring(outputStart, outputEnd);
        const outputText = decodeHtml(outputHtml).replace(/^Output\s*/i, "").trim().substring(0, 200);

        if (inputText) {
          description = description + "\n\nInput: " + inputText;
        }
        if (outputText) {
          description = description + "\n\nOutput: " + outputText;
        }
      }

      // Extract sample tests
      const sampleTestsMatch = html.match(/class="sample-tests"([\s\S]*?)(?=class="note"|<\/div>\s*<\/div>\s*<\/div>|$)/);
      if (sampleTestsMatch) {
        const samplesHtml = sampleTestsMatch[1];
        const inputs = samplesHtml.match(/class="input"[\s\S]*?<pre>([\s\S]*?)<\/pre>/g) || [];
        const outputs = samplesHtml.match(/class="output"[\s\S]*?<pre>([\s\S]*?)<\/pre>/g) || [];

        inputs.slice(0, 2).forEach((inp: string, i: number) => {
          const inPreMatch = inp.match(/<pre>([\s\S]*?)<\/pre>/);
          const outPreMatch = outputs[i] ? outputs[i].match(/<pre>([\s\S]*?)<\/pre>/) : null;
          if (inPreMatch) {
            examples.push({
              input: decodeHtml(inPreMatch[1]).trim().substring(0, 150),
              output: outPreMatch ? decodeHtml(outPreMatch[1]).trim().substring(0, 80) : "See problem",
              explanation: "See problem statement for full details.",
            });
          }
        });
      }
    }
  } catch (err) {
    console.warn("CF scrape failed:", err);
  }

  // If scraping failed or got minimal data, use AI knowledge via the prompt
  // Just return metadata — Groq will use its knowledge of the problem
  if (!description || description.length < 50) {
    description = `Codeforces problem ${contestId}${problemIndex}: "${title}". Tags: ${problem?.tags?.join(", ") || "none"}. Rating: ${problem?.rating || "Unrated"}.`;
  }
  if (examples.length === 0) {
    examples = [{ 
      input: "See problem statement", 
      output: "See problem statement", 
      explanation: `Full problem at ${url}` 
    }];
  }

  const difficulty = problem?.rating
    ? problem.rating <= 1200 ? "Easy" : problem.rating <= 1800 ? "Medium" : "Hard"
    : "Medium";

  return {
    title,
    description,
    examples,
    difficulty,
    tags: (problem?.tags || []).map((t: string) => t.charAt(0).toUpperCase() + t.slice(1)),
    problemId: `cf-${contestId}-${problemIndex.toLowerCase()}`,
  };
};

// ========================================
// CLEAN PLATFORM DATA VIA GROQ
// ========================================
const cleanPlatformData = async (rawData: PlatformProblem): Promise<PlatformProblem> => {
const cleanPrompt = `Clean this DSA problem data. Return only JSON.

Description: ${rawData.description.substring(0, 300)}
Examples: ${JSON.stringify(rawData.examples.slice(0, 1))}
Return ONLY valid JSON:
{
  "description": "clean problem statement in plain English only, no LaTeX, no $$, no HTML. Keep constraints if present.",
  "examples": [
    { "input": "clean formatted input e.g. nums = [2,7,11,15], target = 9", "output": "clean output e.g. [0,1]", "explanation": "clear English explanation" }
  ]
}

Rules: Remove dollar signs, LaTeX, HTML entities. Format example inputs like: key = value. Keep it concise.`;

  try {
    // const raw = await callGroq("You are a precise text cleaner. Return only valid JSON.", cleanPrompt);
    const raw = await callGemini("You are a precise text cleaner. Return only valid JSON.", cleanPrompt);
    const cleaned = JSON.parse(raw);
    return {
      ...rawData,
      description: cleaned.description || rawData.description,
      examples: cleaned.examples?.length > 0 ? cleaned.examples : rawData.examples,
    };
  } catch {
    return rawData;
  }
};

// ========================================
// SYSTEM PROMPT (STRICT SPATIAL ENFORCEMENT)
// ========================================
const buildSystemPrompt = () => `You are an expert DSA educator generating JSON for a 3D algorithm visualizer called Plenum.

CRITICAL RULES:
1. Return ONLY valid JSON. Start with { end with }.
2. problemId = lowercase kebab-case.
3. Generate exactly 5 tutorial frames and 8 solution frames.
4. SPATIAL MATH IS MANDATORY:
   - Always place the main Array at y=0. X coordinates must start at -6 and increase by EXACTLY +4 per index (e.g. [-6,0,0], [-2,0,0], [2,0,0]).
   - Place Pointer Arrows at y=3 (e.g., above the array at [-6,3,0]).
   - Place HashMaps or auxiliary structures at y=-4 (e.g. [0,-4,0]).
   - Place Target Displays or Titles at y=5.
5. Every frame MUST have a scene3D property with camera, objects array, and lights array.
6. Solutions must include Python, JavaScript, C++, Java.

SCENE3D OBJECT TYPES & EXACT FORMATTING:
- array: {"type":"array","values":[2,7,11,15],"positions":[[-6,0,0],[-2,0,0],[2,0,0],[6,0,0]],"highlights":[0],"highlightColor":"#f59e0b","pointerAt":0}
- hashmap-container: {"type":"hashmap-container","position":[0,-4,0],"contents":[{"key":2,"value":0,"highlighted":true}]}
- pointer: {"type":"pointer","position":[-6,3,0],"label":"i=0","color":"#3b82f6"}
- connection-arc: {"type":"connection-arc","from":[-6,0,0],"to":[-2,0,0],"height":3,"color":"#22c55e","label":"sum=9"}
- text-3d: {"type":"text-3d","text":"Target 9","position":[0,5,0],"color":"#a855f7","size":0.6}

FEW-SHOT COMPLETE EXAMPLE (Follow exactly this schema layout):
{
  "problemId": "two-sum",
  "title": "Two Sum",
  "difficulty": "Easy",
  "tags": ["Array", "Hash Table"],
  "description": "Given array and target...",
  "examples": [{"input":"nums=[2,7], target=9","output":"[0,1]","explanation":"because 2+7=9"}],
  "algorithmsRequired": ["hash-map"],
  "solutions": {"Python":"code","JavaScript":"code","C++":"code","Java":"code"},
  "complexity": {"time":"O(n)","space":"O(n)","explanation":"Linear scan"},
  "algorithmTutorial": {
    "algorithmId": "hash-map",
    "algorithmName": "Hash Map",
    "description": "O(1) lookups",
    "frames": [
      {
        "frameNumber": 1,
        "title": "What is a Hash Map?",
        "explanation": "A data structure...",
        "duration": 4,
        "scene3D": {
          "camera": { "position": [0,5,15], "lookAt": [0,0,0] },
          "objects": [
            { "type": "text-3d", "text": "HASH MAP", "position": [0,4,0], "color": "#ffffff", "size": 0.6 },
            { "type": "hashmap-container", "position": [0,0,0], "contents": [] }
          ],
          "lights": [{ "type": "ambient", "intensity": 0.6 }]
        }
      }
    ]
  },
  "problemSolution": {
    "testCase": { "input": {"nums":[2,7],"target":9}, "expectedOutput": [0,1] },
    "frames": [
      {
        "frameNumber": 1,
        "title": "Initialize",
        "explanation": "Start loop",
        "code": "for(let i=0; i<nums.length; i++)",
        "duration": 3,
        "scene3D": {
          "camera": { "position": [0,5,15] },
          "objects": [
            { "type": "array", "values": [2,7], "positions": [[-6,0,0], [-2,0,0]], "highlights": [0] },
            { "type": "pointer", "position": [-6,3,0], "label": "i=0" },
            { "type": "hashmap-container", "position": [0,-4,0], "contents": [] }
          ],
          "lights": [{ "type": "ambient", "intensity": 0.6 }]
        }
      }
    ]
  }
}`;

// ========================================
// GEMINI CALLER (Replacing Groq)
// ========================================
/*
const callGroq = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getGroqKey()}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1, // Set lower for better deterministic JSON geometry
      max_tokens: 8000, // Maximum allowed for full frames
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    throw new Error(`Groq API error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json() as any;
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) throw new Error("Groq returned empty response.");
*/
  // return rawText.replace(/^\`\`\`json\s*/i, "").replace(/^\`\`\`\s*/i, "").replace(/\s*\`\`\`$/i, "").trim();};

const callGemini = async (systemPrompt: string, userPrompt: string): Promise<string> => {
  const url = `${GEMINI_URL}?key=${getGeminiKey()}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      }
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as any;
    throw new Error(`Gemini API error: ${err?.error?.message || response.statusText}`);
  }

  const data = await response.json() as any;
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("Gemini returned empty response.");

  return rawText.replace(/^\`\`\`json\s*/i, "").replace(/^\`\`\`\s*/i, "").replace(/\s*\`\`\`$/i, "").trim();
};

// ========================================
// GENERATE + SAVE — POST /api/ai/generate
// ========================================
export const generateProblem = async (req: Request, res: Response) => {
  try {
    const { platform, problemNumber, problemName } = req.body;

    const hasIdentifier = (problemNumber && problemNumber.trim()) || (problemName && problemName.trim());
    if (!hasIdentifier) {
      return res.status(400).json({ success: false, message: "Please provide a problem number or name." });
    }

    /*
    if (!getGroqKey()) {
      return res.status(503).json({
        success: false,
        message: "Groq API key not configured. Add GROQ_API_KEY to server/.env",
        hint: "Get free key at https://console.groq.com",
      });
    }
    */
    if (!getGeminiKey()) {
      return res.status(503).json({
        success: false,
        message: "Gemini API key not configured. Add GEMINI_API_KEY to server/.env",
        hint: "Get free key at https://aistudio.google.com/app/apikey",
      });
    }

    console.log(`🤖 Generating "${problemName || problemNumber}" from ${platform}...`);

    // ── Step 1: Fetch from platform ──
    let platformData: PlatformProblem | null = null;
    let fetchError = "";

    try {
      if (platform === "leetcode") {
        console.log("📡 Fetching from LeetCode API...");
        const slug = (problemName || problemNumber || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        platformData = await fetchLeetCodeProblem(slug);
        console.log(`✅ LeetCode fetched: "${platformData.title}"`);

      } else if (platform === "codeforces") {
        console.log("📡 Fetching from Codeforces...");
        let contestId = "";
        let problemIndex = "A";
        const combined = (problemNumber || "").trim();
        const cfMatch = combined.match(/^(\d+)([A-Za-z]\d*)$/);
        if (cfMatch) {
          contestId = cfMatch[1];
          problemIndex = cfMatch[2];
        } else if (/^\d+$/.test(combined)) {
          contestId = combined;
          const nameAsIndex = (problemName || "").trim().match(/^([A-Za-z]\d*)$/);
          problemIndex = nameAsIndex ? nameAsIndex[1] : "A";
        } else {
          throw new Error('For Codeforces: enter "2211A" in Problem Number, or "2211" + "A" in Problem Name.');
        }
        platformData = await fetchCodeforcesProblem(contestId, problemIndex);
        console.log(`✅ Codeforces fetched: "${platformData.title}"`);
      }
    } catch (err) {
      fetchError = err instanceof Error ? err.message : "Platform fetch failed";
      console.warn(`⚠️ ${fetchError}`);
    }

    // ── Step 2: Clean platform data ──
    if (platformData) {
      console.log("🧹 Cleaning platform data...");
      try {
        platformData = await cleanPlatformData(platformData);
        console.log("✅ Data cleaned");
      } catch {
        console.warn("⚠️ Cleaning failed, using raw data");
      }
    }

    // ── Step 3: Build prompt ──
    let userPrompt = "";
    if (platformData) {
      const isCf = platform === "codeforces";
      userPrompt = `Generate Plenum 3D visualizer data for this ${platform} problem:

Title: ${platformData.title}
Problem ID: ${platformData.problemId}
Difficulty: ${platformData.difficulty}
Tags: ${platformData.tags.slice(0, 5).join(", ")}

Description:
${platformData.description.substring(0, 300)}

Examples:
${JSON.stringify(platformData.examples.slice(0, 2).map(ex => ({
  input: ex.input.substring(0, 120),
  output: ex.output.substring(0, 60),
  explanation: (ex.explanation || "").substring(0, 120),
})))}

${platform === "codeforces" ? `IMPORTANT: Use your training knowledge of this Codeforces problem to provide accurate full description, real example inputs/outputs with actual numbers, and constraints. Scraped data may be incomplete.` : ""}

Use EXACTLY: problemId="${platformData.problemId}", title="${platformData.title}", difficulty="${platformData.difficulty}"
Generate rich scene3D with actual data values visible at each step.`;
    } else {
      userPrompt = `Generate Plenum 3D visualizer data for: ${problemName || problemNumber} (${platform})
${fetchError ? `Note: ${fetchError} — use your knowledge.` : ""}
Generate rich scene3D showing algorithm step by step.`;
    }

    // ── Step 4: Call Gemini ──
    let rawContent: string;
    try {
      // rawContent = await callGroq(buildSystemPrompt(), userPrompt);
      rawContent = await callGemini(buildSystemPrompt(), userPrompt);
    } catch (apiError) {
      return res.status(502).json({
        success: false,
        message: apiError instanceof Error ? apiError.message : "Gemini API call failed.",
      });
    }

    // ── Step 5: Parse ──
    let problemData: any;
    try {
      problemData = JSON.parse(rawContent);
    } catch {
      return res.status(502).json({ success: false, message: "AI returned invalid JSON. Please try again." });
    }

    // ── Step 6: Override with real platform data ──
    if (platformData) {
      problemData.title = platformData.title;
      problemData.description = platformData.description;
      problemData.difficulty = platformData.difficulty;
      problemData.tags = platformData.tags.length > 0 ? platformData.tags : problemData.tags;
      problemData.problemId = platformData.problemId;
      problemData.examples = platformData.examples.map((ex: any) => ({
        ...ex,
        explanation: ex.explanation?.trim() || "See problem description for details.",
      }));
    }

    // ── Step 7: Validate ──
    const required = ["problemId", "title", "difficulty", "description", "examples", "solutions", "complexity", "algorithmTutorial", "problemSolution"];
    const missing = required.filter(f => !problemData[f]);
    if (missing.length > 0) {
      return res.status(502).json({ success: false, message: `AI missing fields: ${missing.join(", ")}. Try again.` });
    }

    // ── Step 8: Sanitize examples ──
    if (Array.isArray(problemData.examples)) {
      problemData.examples = problemData.examples.map((ex: any) => ({
        input: ex.input || "See problem",
        output: ex.output || "See problem",
        explanation: ex.explanation?.trim() || "See problem description for details.",
      }));
    }

    // ── Step 9: Check duplicate ──
    const existing = await Problem.findOne({ problemId: problemData.problemId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `"${problemData.title}" already exists in the database.`,
        existingId: problemData.problemId,
      });
    }

    // ── Step 10: Save ──
    const saved = await Problem.create(problemData);
    console.log(`✅ "${saved.title}" saved! Tutorial: ${saved.algorithmTutorial?.frames?.length}, Solution: ${saved.problemSolution?.frames?.length}`);

    return res.status(201).json({
      success: true,
      message: `"${saved.title}" generated and saved!`,
      data: {
        problemId: saved.problemId,
        title: saved.title,
        difficulty: saved.difficulty,
        tags: saved.tags,
        tutorialFrames: saved.algorithmTutorial?.frames?.length,
        solutionFrames: saved.problemSolution?.frames?.length,
        languages: Object.keys(saved.solutions || {}),
        source: platformData ? `Fetched from ${platform}` : "AI generated",
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// ========================================
// PREVIEW — POST /api/ai/preview
// ========================================
export const previewProblem = async (req: Request, res: Response) => {
  try {
    const { platform, problemNumber, problemName } = req.body;
    if (!problemName && !problemNumber) {
      return res.status(400).json({ success: false, message: "Problem name or number required" });
    }
    const userPrompt = `Generate Plenum data for: ${problemName || problemNumber} (${platform})`;
    // const rawContent = await callGroq(buildSystemPrompt(), userPrompt);
    const rawContent = await callGemini(buildSystemPrompt(), userPrompt);
    const problemData = JSON.parse(rawContent);
    return res.json({ success: true, message: "Preview generated", data: problemData });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Preview failed",
      error: error instanceof Error ? error.message : "Unknown",
    });
  }
};