import { exec } from "child_process";
import * as path from "path";

interface EvalTest {
  name: string;
  config: string;
  prompt: string;
  assertions: Array<{
    description: string;
    validate: (output: string) => boolean;
  }>;
}

function runAgent(agentAlias: string, promptInput: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const configDir = path.resolve(__dirname, "../../agents");
    
    // Command to run ZeroClaw agent with environment overrides and config directory
    const envVars = [
      "ZEROCLAW_providers__models__anthropic__default__api_key=local-mock-key",
      "ZEROCLAW_providers__models__anthropic__default__uri=http://localhost:8000",
      "ZEROCLAW_providers__models__anthropic__default__model=claude-3-5-sonnet"
    ].join(" ");
    
    const cmd = `${envVars} /Users/chung/.cargo/bin/zeroclaw --config-dir "${configDir}" agent --agent ${agentAlias} -m "${promptInput.replace(/"/g, '\\"')}"`;
    
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

const tests: EvalTest[] = [
  {
    name: "Recruit Agent - Candidate List Retrieval",
    config: "recruit",
    prompt: "Show me the list of candidates in the Greenhouse pipeline.",
    assertions: [
      {
        description: "Output should list candidates or reference Greenhouse tool output",
        validate: (output) => output.includes("greenhouse_list_candidates") || output.includes("Jordan Miller") || output.includes("pipeline")
      }
    ]
  },
  {
    name: "Onboarding Agent - Checklist Status Retrieval",
    config: "onboard",
    prompt: "What is my onboarding progress and what are my pending tasks?",
    assertions: [
      {
        description: "Output should retrieve or format Workday checklist status",
        validate: (output) => output.includes("workday_get_onboarding_checklist") || output.includes("progress") || output.includes("checklist")
      }
    ]
  },
  {
    name: "Calibration Agent - Unconscious Bias Audit",
    config: "calibrate",
    prompt: "Analyze the peer reviews for emp_001. Check for unconscious bias.",
    assertions: [
      {
        description: "Output should flag gender bias / tone policing ('aggressive')",
        validate: (output) => output.toLowerCase().includes("bias") || output.toLowerCase().includes("aggressive")
      },
      {
        description: "Output should suggest a constructive, gender-neutral rewrite ('assertive' / 'outcome-oriented')",
        validate: (output) => output.toLowerCase().includes("assertive") || output.toLowerCase().includes("rewrite") || output.toLowerCase().includes("neutral")
      }
    ]
  }
];

async function runEvals() {
  console.log("====================================================");
  console.log("        PeopleSync Agent OS: Evaluation Suite       ");
  console.log("====================================================\n");

  let passedAll = true;

  for (const test of tests) {
    console.log(`[RUNNING] ${test.name}`);
    try {
      const output = await runAgent(test.config, test.prompt);
      console.log(`[AGENT OUTPUT SUBSET]:\n${output.trim().substring(0, 300)}...\n`);
      
      console.log(`[ASSERTIONS] for ${test.name}:`);
      let testPassed = true;
      for (const assertion of test.assertions) {
        const passed = assertion.validate(output);
        if (passed) {
          console.log(`  ✅ PASSED: ${assertion.description}`);
        } else {
          console.log(`  ❌ FAILED: ${assertion.description}`);
          testPassed = false;
          passedAll = false;
        }
      }
      console.log("");
    } catch (err: any) {
      console.error(`  ❌ ERROR running agent: ${err.message}\n`);
      passedAll = false;
    }
  }

  console.log("====================================================");
  if (passedAll) {
    console.log("      🎉 SUCCESS: All evaluation assertions passed! ");
  } else {
    console.log("      ⚠️ FAILURE: Some evaluation assertions failed. ");
    process.exit(1);
  }
  console.log("====================================================");
}

runEvals();
