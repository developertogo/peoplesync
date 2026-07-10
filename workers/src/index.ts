import { registerWorker } from "iii-sdk";
import { exec } from "child_process";
import * as path from "path";

const III_URL = process.env.III_URL || "ws://localhost:49134";

// Function to run a ZeroClaw agent subprocess
function runZeroClawAgent(configPath: string, promptInput: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const configDir = path.resolve(__dirname, "../../agents");
    
    // Extract agent alias from the configPath string
    let agentAlias = "recruit";
    if (configPath.includes("onboard")) {
      agentAlias = "onboard";
    } else if (configPath.includes("calibrate")) {
      agentAlias = "calibrate";
    }
    
    console.log(`Spawning ZeroClaw agent: ${agentAlias}`);
    
    // Command to run ZeroClaw agent with environment overrides and config directory
    const envVars = [
      "ZEROCLAW_providers__models__anthropic__default__api_key=local-mock-key",
      "ZEROCLAW_providers__models__anthropic__default__uri=http://localhost:8000",
      "ZEROCLAW_providers__models__anthropic__default__model=claude-3-5-sonnet"
    ].join(" ");
    
    const cmd = `${envVars} /Users/chung/.cargo/bin/zeroclaw --config-dir "${configDir}" agent --agent ${agentAlias} -m "${promptInput.replace(/"/g, '\\"')}"`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`ZeroClaw execution error: ${error.message}`);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

let worker: any = null;

if (process.env.NODE_ENV !== "test") {
  console.log(`Connecting to iii.dev engine at ${III_URL}...`);

  // Initialize the worker on the iii message bus
  worker = registerWorker(III_URL);

  // Register the custom "state_change" trigger type so the engine accepts state change triggers
  worker.registerTriggerType({
    id: "state_change",
    description: "Triggered on database state changes"
  }, {
    registerTrigger: async (trigger: any) => {
      console.log(`Registered state_change trigger: ${trigger.id} for function ${trigger.function_id}`);
    },
    unregisterTrigger: async (trigger: any) => {
      console.log(`Unregistered state_change trigger: ${trigger.id}`);
    }
  });

  // 1. Register Trigger for Greenhouse Candidate Hiring
  worker.registerTrigger({
    type: "state_change",
    function_id: "greenhouse::candidate_hired",
    config: {
      event: "candidate::hired"
    }
  });

  // Implement the Hired handler function which triggers the Onboarding Agent
  worker.registerFunction("greenhouse::candidate_hired", async (payload: any) => {
    const candidateId = payload.candidateId || "cnd_001";
    console.log(`Event Trigger: Candidate ${candidateId} Hired! Triggering Onboarding Agent...`);
    
    // Call iii trigger to run onboarding analysis
    await worker.trigger({
      function_id: "agent::run_onboarding",
      payload: {
        agentConfig: "agents/onboard_agent.toml",
        employeeId: "emp_001",
        prompt: `Analyze the onboarding checklist and account status for employee emp_001.`
      }
    });
  });

  // 2. Register Function to Run Onboarding Agent
  worker.registerFunction("agent::run_onboarding", async (payload: any) => {
    const config = payload.agentConfig || "agents/onboard_agent.toml";
    const prompt = payload.prompt || "Verify onboarding status.";
    console.log(`Running Onboarding Agent with config ${config}...`);
    
    try {
      const result = await runZeroClawAgent(config, prompt);
      console.log("Onboarding Agent complete!");
      return { success: true, result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 3. Register Function to Run Recruiting Agent
  worker.registerFunction("agent::run_recruiting", async (payload: any) => {
    const config = payload.agentConfig || "agents/recruit_agent.toml";
    const prompt = payload.prompt || "List candidates in the Greenhouse pipeline.";
    console.log(`Running Recruiting Agent with config ${config}...`);
    
    try {
      const result = await runZeroClawAgent(config, prompt);
      console.log("Recruiting Agent complete!");
      return { success: true, result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  // 4. Register Function to Run Calibration Agent
  worker.registerFunction("agent::run_calibration", async (payload: any) => {
    const config = payload.agentConfig || "agents/calibrate_agent.toml";
    const prompt = payload.prompt || "Analyze performance reviews and check for biases.";
    console.log(`Running Calibration Agent with config ${config}...`);
    
    try {
      const result = await runZeroClawAgent(config, prompt);
      console.log("Calibration Agent complete!");
      return { success: true, result };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  console.log("PeopleSync Workers fully registered on the event bus.");
}

export { runZeroClawAgent, worker };
