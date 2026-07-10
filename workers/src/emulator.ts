import * as http from "http";

const PORT = 8000;

interface Message {
  role: "user" | "assistant";
  content: string | Array<{
    type: "text" | "tool_use" | "tool_result";
    text?: string;
    id?: string;
    name?: string;
    input?: any;
    output?: string;
  }>;
}

interface MessagesRequest {
  model: string;
  messages: Message[];
  system?: string;
  tools?: Array<{
    name: string;
    description: string;
    input_schema: any;
  }>;
}

const server = http.createServer((req, res) => {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key, anthropic-version");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/v1/messages") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const payload: MessagesRequest = JSON.parse(body);
        const responseData = handleClaudeMock(payload);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(responseData));
      } catch (err: any) {
        console.error("Error parsing Claude API request:", err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: { type: "invalid_request_error", message: err.message } }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: { message: "Not Found" } }));
  }
});

function handleClaudeMock(request: MessagesRequest) {
  const lastMessage = request.messages[request.messages.length - 1];
  const lastContent = lastMessage.content;

  // 1. Check if the last message contains a tool result
  if (Array.isArray(lastContent)) {
    const toolResult = lastContent.find(c => c.type === "tool_result") as any;
    if (toolResult) {
      console.log("EMULATOR MOCK RECEIVED TOOL RESULT:", JSON.stringify(toolResult, null, 2));
      const toolUseId = toolResult.tool_use_id || "";
      const content = toolResult.content || "";
      let toolOutput = "";
      if (typeof content === "string") {
        try {
          const parsedContent = JSON.parse(content);
          if (parsedContent && Array.isArray(parsedContent.content)) {
            const textBlock = parsedContent.content.find((c: any) => c.type === "text");
            if (textBlock && typeof textBlock.text === "string") {
              toolOutput = textBlock.text;
            } else {
              toolOutput = JSON.stringify(parsedContent.content);
            }
          } else {
            toolOutput = content;
          }
        } catch {
          toolOutput = content;
        }
      } else if (Array.isArray(content)) {
        toolOutput = content.find(c => c.type === "text")?.text || JSON.stringify(content);
      }

      let parsedOutput: any = {};
      try {
        parsedOutput = JSON.parse(toolOutput);
      } catch {
        parsedOutput = toolOutput;
      }

      // Generate response explaining the tool output
      let textResponse = `Successfully processed tool call. Details: ${toolOutput}`;

      if (toolUseId && toolUseId.includes("list_cnd")) {
        textResponse = `Here are the candidates currently in the Greenhouse pipeline: ${JSON.stringify(parsedOutput, null, 2)}`;
      } else if (toolUseId && toolUseId.includes("get_cnd")) {
        textResponse = `Here is the profile for the candidate: ${JSON.stringify(parsedOutput, null, 2)}`;
      } else if (toolUseId && toolUseId.includes("submit_fb")) {
        textResponse = `Logged interview scorecard feedback. Current status: ${toolOutput}`;
      } else if (toolUseId && toolUseId.includes("get_profile")) {
        textResponse = `Here is the profile card: ${JSON.stringify(parsedOutput, null, 2)}`;
      } else if (toolUseId && toolUseId.includes("get_checklist")) {
        const completed = parsedOutput.items?.filter((i: any) => i.status === "completed") || [];
        const pending = parsedOutput.items?.filter((i: any) => i.status === "pending") || [];
        textResponse = `Onboarding checklist status:\n- Total completed: ${parsedOutput.checklist_completed_percentage}%\n- Completed tasks: ${completed.map((t: any) => t.name).join(", ")}\n- Pending tasks: ${pending.map((t: any) => t.name).join(", ")}`;
      } else if (toolUseId && toolUseId.includes("update_checklist")) {
        textResponse = `Successfully marked task as completed. Check list updated: ${toolOutput}`;
      } else if (toolUseId && toolUseId.includes("provision")) {
        textResponse = `Provisioning event logged. Status: ${toolOutput}`;
      } else if (toolUseId && toolUseId.includes("get_notes")) {
        textResponse = `I retrieved the peer feedback: ${JSON.stringify(parsedOutput, null, 2)}.\n\nUpon review, I noticed some potential unconscious bias:\n- "She is aggressive in meetings": Flagged as potential gender-based bias. Recommend rewriting to: "She is highly assertive, direct, and outcome-oriented in group discussions."\n- "He is a bit quiet lately": Flagged as potential recency bias. Focus instead on concrete output over the full review period.`;
      }

      return makeTextResponse(textResponse);
    }
  }

  // 2. Otherwise, parse the text prompt and determine if we need to call a tool
  const userText = typeof lastContent === "string" 
    ? lastContent 
    : lastContent.find(c => c.type === "text")?.text || "";

  const textLower = userText.toLowerCase();

  // Recruit Agent Tools
  if (textLower.includes("list candidates") || textLower.includes("pipeline")) {
    return makeToolUseResponse("hr_platform__greenhouse_list_candidates", {}, "list_cnd_" + Date.now());
  }
  if (textLower.includes("get candidate") || textLower.includes("view candidate")) {
    // Extract candidate ID like cnd_001
    const match = userText.match(/cnd_\d+/);
    const candidateId = match ? match[0] : "cnd_001";
    return makeToolUseResponse("hr_platform__greenhouse_get_candidate", { candidateId }, "get_cnd_" + Date.now());
  }
  if (textLower.includes("submit feedback") || textLower.includes("scorecard") || textLower.includes("interviewer")) {
    return makeToolUseResponse("hr_platform__greenhouse_submit_interview_feedback", {
      candidateId: "cnd_001",
      interviewer: "Alice Miller",
      score: 4,
      notes: "Strong technical candidate with good React background."
    }, "submit_fb_" + Date.now());
  }

  // Onboard Agent Tools
  if (textLower.includes("checklist") || textLower.includes("onboarding progress") || textLower.includes("tasks")) {
    return makeToolUseResponse("hr_platform__workday_get_onboarding_checklist", { employeeId: "emp_001" }, "get_checklist_" + Date.now());
  }
  if (textLower.includes("complete task") || textLower.includes("check off") || textLower.includes("finish paperwork")) {
    return makeToolUseResponse("hr_platform__workday_update_checklist", {
      employeeId: "emp_001",
      itemId: "task_paperwork",
      status: "completed"
    }, "update_checklist_" + Date.now());
  }
  if (textLower.includes("slack") || textLower.includes("github") || textLower.includes("provision") || textLower.includes("aws")) {
    return makeToolUseResponse("hr_platform__rippling_provision_accounts", {
      employeeId: "emp_001",
      appName: "Slack",
      status: "active"
    }, "provision_" + Date.now());
  }
  if (textLower.includes("profile") || textLower.includes("who am i")) {
    return makeToolUseResponse("hr_platform__workday_get_profile", { employeeId: "emp_001" }, "get_profile_" + Date.now());
  }

  // Calibrate Agent Tools
  if (textLower.includes("bias") || textLower.includes("feedback") || textLower.includes("reviews") || textLower.includes("calibrate")) {
    return makeToolUseResponse("hr_platform__feedback_get_notes", { employeeId: "emp_001" }, "get_notes_" + Date.now());
  }

  // Default general chatbot responses
  let defaultReply = "I am the PeopleSync Agent OS assistant. I can help you evaluate candidates, manage onboarding tasks, or audit reviews for bias. Ask me about your 'checklist' or to 'list candidates' to start!";
  if (textLower.includes("hello") || textLower.includes("hi")) {
    defaultReply = "Hello! I am your AI Coach. How can I help you today with onboarding, recruiting, or performance reviews?";
  }

  return makeTextResponse(defaultReply);
}

function makeTextResponse(text: string) {
  return {
    id: "msg_" + Math.random().toString(36).substr(2, 9),
    type: "message",
    role: "assistant",
    model: "claude-3-5-sonnet-mocked",
    content: [
      {
        type: "text",
        text: text
      }
    ],
    stop_reason: "end_turn",
    stop_sequence: null,
    usage: {
      input_tokens: 50,
      output_tokens: 50
    }
  };
}

function makeToolUseResponse(name: string, input: any, toolUseId: string) {
  return {
    id: "msg_" + Math.random().toString(36).substr(2, 9),
    type: "message",
    role: "assistant",
    model: "claude-3-5-sonnet-mocked",
    content: [
      {
        type: "tool_use",
        id: toolUseId,
        name: name,
        input: input
      }
    ],
    stop_reason: "tool_use",
    stop_sequence: null,
    usage: {
      input_tokens: 60,
      output_tokens: 40
    }
  };
}

server.listen(PORT, () => {
  console.log(`Claude API Mock Emulator running on http://localhost:${PORT}`);
});
