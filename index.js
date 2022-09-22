const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts");
var clc = require("cli-color");
const { Command } = require("commander");
const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      const contacts = await listContacts();
      console.table(contacts);
      break;

    case "get":
      const currentContact = await getContactById(id);
      if (!currentContact) {
        return console.log(
          clc.red.bold.bgWhite(`Contact with id: ${id} was not found`)
        );
      }
      console.log(currentContact);
      break;

    case "add":
      const newContact = await addContact(name, email, phone);
      console.log(
        clc.green.bold.bgWhite("This contact is saved successfully!")
      );
      console.log(newContact);
      break;

    case "remove":
      const removedContact = await removeContact(id);
      if (!removedContact) {
        return console.log(
          clc.red.bold.bgWhite(`Contact with id: ${id} was not found`)
        );
      }
      console.log(clc.green.bold.bgWhite("This contact is removed!"));
      console.log(removedContact);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
