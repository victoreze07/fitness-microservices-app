import { createServer } from "node:http";

const port = Number(process.env.PORT || 4001);

const workouts = [
  {
    name: "Strength Builder",
    focus: "Full body",
    duration: "45 min",
    level: "Intermediate",
    equipment: "Dumbbells",
    schedule: "Mon, Wed, Fri",
    highlights: ["Squat press", "Romanian deadlift", "Push-up rows"]
  },
  {
    name: "Cardio Engine",
    focus: "Intervals",
    duration: "28 min",
    level: "All levels",
    equipment: "Bodyweight",
    schedule: "Tue, Sat",
    highlights: ["Sprint blocks", "Mountain climbers", "Core finisher"]
  },
  {
    name: "Mobility Reset",
    focus: "Recovery",
    duration: "20 min",
    level: "Beginner",
    equipment: "Mat",
    schedule: "Daily",
    highlights: ["Hip openers", "Thoracic rotation", "Breathing reset"]
  }
];

const featuredPlan = {
  title: "4-week balanced plan",
  goal: "Build consistency across strength, conditioning, and recovery.",
  weeklyTarget: "5 sessions",
  restDays: "2 active recovery days"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const server = createServer((req, res) => {
  if (req.url === "/health") {
    sendJson(res, 200, { status: "ok", service: "workout-service" });
    return;
  }

  if (req.url === "/workouts") {
    sendJson(res, 200, { featuredPlan, items: workouts });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`workout-service listening on ${port}`);
});
