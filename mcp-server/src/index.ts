import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define TypeScript interfaces for our DB structure
interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  stage: string;
  applied_at: string;
  target_job: {
    id: string;
    title: string;
    department: string;
  };
  resume: string;
  interview_feedback: Array<{
    interviewer: string;
    score: number;
    notes: string;
  }>;
}

interface OnboardingItem {
  id: string;
  name: string;
  status: 'pending' | 'completed';
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  personal_email: string;
  work_email: string;
  title: string;
  hire_date: string;
  supervisory_organization: string;
  manager_id: string | null;
  direct_reports: string[];
  peers: string[];
  onboarding: {
    checklist_completed_percentage: number;
    items: OnboardingItem[];
  };
}

interface ProvisionedAccount {
  app_name: string;
  account_email: string;
  status: 'active' | 'pending' | 'inactive';
}

interface Feedback {
  id: string;
  employee_id: string;
  reviewer: string;
  content: string;
  type: 'self' | 'peer';
}

interface Database {
  candidates: Candidate[];
  employees: Employee[];
  provisioned_accounts: Record<string, ProvisionedAccount[]>;
  feedback: Feedback[];
}

const DB_PATH = path.join(__dirname, "..", "src", "db.json");

// Helper functions to read/write state
function readDb(): Database {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read database file:", error);
    throw new McpError(ErrorCode.InternalError, "Failed to read database state");
  }
}

function writeDb(db: Database): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write to database file:", error);
    throw new McpError(ErrorCode.InternalError, "Failed to write database state");
  }
}

// Initialize the MCP Server
const server = new Server(
  {
    name: "peoplesync-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "greenhouse_list_candidates",
        description: "List all job applications and candidates in the Greenhouse pipeline.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "greenhouse_get_candidate",
        description: "Retrieve a specific candidate's application, contact details, stages, and full text resume.",
        inputSchema: {
          type: "object",
          properties: {
            candidateId: { type: "string", description: "The ID of the candidate (e.g., cnd_001)" },
          },
          required: ["candidateId"],
        },
      },
      {
        name: "greenhouse_submit_interview_feedback",
        description: "Submit feedback score and notes from an interview round for a candidate.",
        inputSchema: {
          type: "object",
          properties: {
            candidateId: { type: "string" },
            interviewer: { type: "string" },
            score: { type: "number", minimum: 1, maximum: 5 },
            notes: { type: "string" },
          },
          required: ["candidateId", "interviewer", "score", "notes"],
        },
      },
      {
        name: "workday_get_profile",
        description: "Retrieve basic Workday profile card for an employee (title, email, organization, manager).",
        inputSchema: {
          type: "object",
          properties: {
            employeeId: { type: "string" },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "workday_get_org",
        description: "Retrieve supervisory organizational graph nodes for an employee (manager, peers, direct reports).",
        inputSchema: {
          type: "object",
          properties: {
            employeeId: { type: "string" },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "workday_get_onboarding_checklist",
        description: "Retrieve the checklist items and completion progress for a new hire in Workday.",
        inputSchema: {
          type: "object",
          properties: {
            employeeId: { type: "string" },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "workday_update_checklist",
        description: "Update the status of a specific task item in an employee's onboarding checklist.",
        inputSchema: {
          type: "object",
          properties: {
            employeeId: { type: "string" },
            itemId: { type: "string" },
            status: { type: "string", enum: ["pending", "completed"] },
          },
          required: ["employeeId", "itemId", "status"],
        },
      },
      {
        name: "rippling_provision_accounts",
        description: "Trigger IT application and account provisioning status (Slack, GitHub, AWS) in Rippling.",
        inputSchema: {
          type: "object",
          properties: {
            employeeId: { type: "string" },
            appName: { type: "string", enum: ["Slack", "GitHub", "AWS Sandbox"] },
            status: { type: "string", enum: ["active", "pending", "inactive"] },
          },
          required: ["employeeId", "appName", "status"],
        },
      },
      {
        name: "feedback_get_notes",
        description: "Retrieve all aggregated peer feedback and self-reviews for calibration analysis of an employee.",
        inputSchema: {
          type: "object",
          properties: {
            employeeId: { type: "string" },
          },
          required: ["employeeId"],
        },
      },
    ],
  };
});

// Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const db = readDb();

  try {
    switch (name) {
      case "greenhouse_list_candidates": {
        const candidateList = db.candidates.map(c => ({
          id: c.id,
          name: `${c.first_name} ${c.last_name}`,
          email: c.email,
          stage: c.stage,
          target_job: c.target_job.title
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(candidateList, null, 2) }]
        };
      }

      case "greenhouse_get_candidate": {
        const { candidateId } = args as { candidateId: string };
        const candidate = db.candidates.find(c => c.id === candidateId);
        if (!candidate) {
          throw new McpError(ErrorCode.InvalidParams, `Candidate ${candidateId} not found`);
        }
        return {
          content: [{ type: "text", text: JSON.stringify(candidate, null, 2) }]
        };
      }

      case "greenhouse_submit_interview_feedback": {
        const { candidateId, interviewer, score, notes } = args as {
          candidateId: string;
          interviewer: string;
          score: number;
          notes: string;
        };
        const candidate = db.candidates.find(c => c.id === candidateId);
        if (!candidate) {
          throw new McpError(ErrorCode.InvalidParams, `Candidate ${candidateId} not found`);
        }

        candidate.interview_feedback.push({ interviewer, score, notes });

        // If score is high (e.g., >= 4) and we have feedback, mock transition stage
        if (score >= 4 && candidate.stage === "recruiter_screen") {
          candidate.stage = "technical_interview";
        }

        writeDb(db);
        return {
          content: [{ type: "text", text: `Feedback successfully logged for candidate ${candidateId}. Current stage: ${candidate.stage}` }]
        };
      }

      case "workday_get_profile": {
        const { employeeId } = args as { employeeId: string };
        const employee = db.employees.find(e => e.id === employeeId);
        if (!employee) {
          throw new McpError(ErrorCode.InvalidParams, `Employee ${employeeId} not found`);
        }
        return {
          content: [{
            type: "text", text: JSON.stringify({
              id: employee.id,
              name: `${employee.first_name} ${employee.last_name}`,
              title: employee.title,
              personal_email: employee.personal_email,
              work_email: employee.work_email,
              email: employee.work_email,
              hire_date: employee.hire_date,
              supervisory_organization: employee.supervisory_organization
            }, null, 2)
          }]
        };
      }

      case "workday_get_org": {
        const { employeeId } = args as { employeeId: string };
        const employee = db.employees.find(e => e.id === employeeId);
        if (!employee) {
          throw new McpError(ErrorCode.InvalidParams, `Employee ${employeeId} not found`);
        }

        const manager = employee.manager_id ? db.employees.find(e => e.id === employee.manager_id) : null;
        const peers = db.employees.filter(e => employee.peers.includes(e.id));
        const reports = db.employees.filter(e => employee.direct_reports.includes(e.id));

        const orgChart = {
          manager: manager ? `${manager.first_name} ${manager.last_name} (${manager.title})` : "None",
          peers: peers.map(p => `${p.first_name} ${p.last_name} (${p.title})`),
          direct_reports: reports.map(r => `${r.first_name} ${r.last_name} (${r.title})`)
        };

        return {
          content: [{ type: "text", text: JSON.stringify(orgChart, null, 2) }]
        };
      }

      case "workday_get_onboarding_checklist": {
        const { employeeId } = args as { employeeId: string };
        const employee = db.employees.find(e => e.id === employeeId);
        if (!employee) {
          throw new McpError(ErrorCode.InvalidParams, `Employee ${employeeId} not found`);
        }
        return {
          content: [{ type: "text", text: JSON.stringify(employee.onboarding, null, 2) }]
        };
      }

      case "workday_update_checklist": {
        const { employeeId, itemId, status } = args as {
          employeeId: string;
          itemId: string;
          status: 'pending' | 'completed';
        };
        const employee = db.employees.find(e => e.id === employeeId);
        if (!employee) {
          throw new McpError(ErrorCode.InvalidParams, `Employee ${employeeId} not found`);
        }

        const task = employee.onboarding.items.find(item => item.id === itemId);
        if (!task) {
          throw new McpError(ErrorCode.InvalidParams, `Checklist item ${itemId} not found`);
        }

        task.status = status;

        // Recalculate percentage completed
        const completed = employee.onboarding.items.filter(item => item.status === 'completed').length;
        employee.onboarding.checklist_completed_percentage = Math.round(
          (completed / employee.onboarding.items.length) * 100
        );

        writeDb(db);
        return {
          content: [{ type: "text", text: `Checklist item ${itemId} status updated to ${status}. Total completion: ${employee.onboarding.checklist_completed_percentage}%` }]
        };
      }

      case "rippling_provision_accounts": {
        const { employeeId, appName, status } = args as {
          employeeId: string;
          appName: 'Slack' | 'GitHub' | 'AWS Sandbox';
          status: 'active' | 'pending' | 'inactive';
        };

        if (!db.provisioned_accounts[employeeId]) {
          db.provisioned_accounts[employeeId] = [];
        }

        const app = db.provisioned_accounts[employeeId].find(a => a.app_name === appName);
        if (app) {
          app.status = status;
        } else {
          // If mock employee profile exists in directory, fetch details
          const employee = db.employees.find(e => e.id === employeeId);
          db.provisioned_accounts[employeeId].push({
            app_name: appName,
            account_email: employee ? employee.work_email : `${employeeId}@mock-provision.com`,
            status
          });
        }

        writeDb(db);
        return {
          content: [{ type: "text", text: `Rippling provisioning event logged for ${employeeId}: App ${appName} set to ${status}.` }]
        };
      }

      case "feedback_get_notes": {
        const { employeeId } = args as { employeeId: string };
        const items = db.feedback.filter(fb => fb.employee_id === employeeId);
        return {
          content: [{ type: "text", text: JSON.stringify(items, null, 2) }]
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    console.error("Error executing tool:", error);
    throw new McpError(ErrorCode.InternalError, "Internal error executing tool");
  }
});

// Run Server using stdio transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("PeopleSync MCP Server started on stdio transport");
}

if (process.env.NODE_ENV !== "test") {
  run().catch((error) => {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  });
}

export { server, readDb, writeDb };
