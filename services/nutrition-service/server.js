import { createServer } from "node:http";

const port = Number(process.env.PORT || 4002);

const meals = [
  {
    name: "Power Breakfast Bowl",
    calories: 520,
    protein: "34g",
    carbs: "58g",
    fat: "18g",
    timing: "Breakfast",
    ingredients: ["Greek yogurt", "Oats", "Berries", "Almond butter"]
  },
  {
    name: "Lean Lunch Plate",
    calories: 610,
    protein: "46g",
    carbs: "62g",
    fat: "20g",
    timing: "Lunch",
    ingredients: ["Chicken breast", "Brown rice", "Greens", "Avocado"]
  },
  {
    name: "Recovery Smoothie",
    calories: 330,
    protein: "28g",
    carbs: "42g",
    fat: "7g",
    timing: "Post-workout",
    ingredients: ["Protein powder", "Banana", "Spinach", "Milk"]
  }
];

const targets = {
  calories: "2,100",
  protein: "155g",
  hydration: "3.0L",
  focus: "High protein, steady energy"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

const server = createServer((req, res) => {
  if (req.url === "/health") {
    sendJson(res, 200, { status: "ok", service: "nutrition-service" });
    return;
  }

  if (req.url === "/meals") {
    sendJson(res, 200, { targets, items: meals });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`nutrition-service listening on ${port}`);
});
