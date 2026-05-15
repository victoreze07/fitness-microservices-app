import { createServer } from "node:http";

const port = Number(process.env.PORT || 4003);

const summary = [
  { label: "Weekly workouts", value: "5", change: "+2 vs last week" },
  { label: "Active minutes", value: "214", change: "+38 min" },
  { label: "Consistency", value: "86%", change: "+9%" }
];

const milestones = [
  { name: "First 5-session week", status: "Complete" },
  { name: "10,000 active minutes", status: "In progress" },
  { name: "8-week consistency streak", status: "Next goal" }
];

const weeklyTrend = [
  { week: "Week 1", completion: 62 },
  { week: "Week 2", completion: 74 },
  { week: "Week 3", completion: 80 },
  { week: "Week 4", completion: 86 }
];

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const server = createServer((req, res) => {
  if (req.url === "/health") {
    sendJson(res, 200, { status: "ok", service: "progress-service" });
    return;
  }

  if (req.url === "/summary") {
    sendJson(res, 200, { items: summary, milestones, weeklyTrend });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`progress-service listening on ${port}`);
});
