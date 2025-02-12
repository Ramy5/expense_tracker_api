import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;
const expenses = [];

app.use(express.json());

mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const expenseSchema = new mongoose.Schema({
  amount: Number,
  name: String,
  category: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

// GET ALL EXPENSES DATA
app.get("/api/expenses", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// CREATE A NEW EXPENSES
app.post("/api/expenses", async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();

  res
    .status(201, { message: "the expense was created successfully!" })
    .json(expense);
});
