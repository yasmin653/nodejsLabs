const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const { description } = require("commander");

const adapter = new FileSync("notes.json");
const db = lowdb(adapter);
const x = db.defaults({ notes: [] }).write();
console.log(x["notes"]);
const shortid = require("shortid");

const { program } = require("commander");
program
  .command("add")
  .option("--status <type>")
  .requiredOption("--title <type>")
  .requiredOption("--descript <type>")
  .description("add note")
  .action((options) => {
    db.get("notes")
      .push({
        id: shortid.generate(),
        status: options.status || "todo",
        title: options.title,
        description: options.descript,
      })
      .write();
  });
program
  .command("list")
  .description("select all notes")
  .action(() => {
    console.log(db.getState());
  });
program
  .command("editTite")
  .description("edit Tite")
  .requiredOption("--id <type>")
  .requiredOption("--newTitle <type>")
  .action((options) => {
    db.get("notes")
      .find({ id: options.id })
      .assign({ title: options.newTitle })
      .write();
  });
program
  .command("delete")
  .description("delete Todo")
  .requiredOption("--id <type>")
  .action((options) => {
    db.get("notes").remove({ id: options.id }).write();
  });
program.parse(process.argv);
