#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

console.log(
  chalk.rgb(242, 145, 48)("\n\tWelcome to CodeWithZefi - Todo List Project\n\t")
);

const menuChoices = [
  { name: "Add a new todo", value: "add" },
  { name: "Delete a todo", value: "delete" },
  { name: "View a todo", value: "view" },
  { name: "Complete a todo", value: "complete" },
  { name: "Update a todo", value: "update" },
  { name: "View all todos", value: "list" },
  { name: "Exit", value: "exit" },
];

const mainMenu = async () => {
  const answer = await inquirer.prompt({
    type: "list",
    name: "action",
    message: chalk.rgb(255, 233, 2)("What would you like to do?"),
    choices: menuChoices,
  });

  switch (answer.action) {
    case "add":
      await addTodo();
      break;
    case "delete":
      await deleteTodo();
      break;
    case "view":
      await viewTodo();
      break;
    case "complete":
      await completeTodo();
      break;
    case "update":
      await updateTodo();
      break;
    case "list":
      listTodos();
      break;
    case "exit":
      console.log(chalk.rgb(130, 213, 234)("\tGoodbye!\t"));
      process.exit();
  }

  mainMenu();
};

const addTodo = async () => {
  let condition = true;

  while (condition) {
    const answer = await inquirer.prompt([
      {
        name: "task",
        type: "input",
        message: "What do you want to add to your todo list?",
      },
      {
        name: "addMore",
        type: "confirm",
        message: chalk.cyan("Do you want to add more?"),
        default: true,
      },
    ]);

    const newTodo: Todo = {
      id: nextId++,
      task: answer.task,
      completed: false,
    };

    todos.push(newTodo);
    console.log(`Added: ${newTodo.task}`);
    condition = answer.addMore;
  }
};

const deleteTodo = async () => {
  if (todos.length === 0) {
    console.log("No todos to delete.");
    return;
  }

  const choices = todos.map((todo) => ({
    name: todo.task,
    value: todo.id,
  }));

  const answer = await inquirer.prompt({
    type: "list",
    name: "id",
    message: chalk.rgb(230, 16, 49)("Select a todo to delete:"),
    choices,
  });

  todos = todos.filter((todo) => todo.id !== answer.id);
  console.log("Deleted the selected todo.");
};

const viewTodo = async () => {
  if (todos.length === 0) {
    console.log("No todos to view.");
    return;
  }

  const choices = todos.map((todo) => ({
    name: todo.task,
    value: todo.id,
  }));

  const answer = await inquirer.prompt({
    type: "list",
    name: "id",
    message: "Select a todo to view:",
    choices,
  });

  const todo = todos.find((t) => t.id === answer.id);
  if (todo) {
    console.log(`Task: ${todo.task}\nCompleted: ${todo.completed}`);
  }
};

const completeTodo = async () => {
  if (todos.length === 0) {
    console.log("No todos to complete.");
    return;
  }

  const choices = todos.map((todo) => ({
    name: todo.task,
    value: todo.id,
  }));

  const answer = await inquirer.prompt({
    type: "list",
    name: "id",
    message: "Select a todo to complete:",
    choices,
  });

  const todo = todos.find((t) => t.id === answer.id);
  if (todo) {
    todo.completed = true;
    console.log(`Completed: ${todo.task}`);
  }
};

const updateTodo = async () => {
  if (todos.length === 0) {
    console.log("No todos to update.");
    return;
  }

  const choices = todos.map((todo) => ({
    name: todo.task,
    value: todo.id,
  }));

  const answer = await inquirer.prompt({
    type: "list",
    name: "id",
    message: "Select a todo to update:",
    choices,
  });

  const todo = todos.find((t) => t.id === answer.id);
  if (todo) {
    const updatedTask = await inquirer.prompt({
      type: "input",
      name: "task",
      message: "Enter the new task:",
      default: todo.task,
    });

    todo.task = updatedTask.task;
    console.log(`Updated: ${todo.task}`);
  }
};

const listTodos = () => {
  if (todos.length === 0) {
    console.log("No todos found.");
  } else {
    todos.forEach((todo) => {
      console.log(`${todo.id}. [${todo.completed ? "✓" : " "}] ${todo.task}`);
    });
  }
};

mainMenu();
