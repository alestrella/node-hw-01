const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
var clc = require("cli-color");

const contactsPath = path.resolve(__dirname, "db/contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const currentContact = contacts.find(({ id }) => id === contactId);
    return currentContact ? currentContact : null;
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const contactIndex = contacts.findIndex(({ id }) => id === contactId);
    if (contactIndex === -1) {
      return null;
    }
    const removedContact = contacts.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    console.log(clc.green.bold.bgWhite("This contact is removed!"));
    return removedContact;
  } catch (error) {
    console.log(clc.red.bgWhite("Failed to remove the contact"), error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone,
    };
    const contacts = await listContacts();
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    console.log(clc.green.bold.bgWhite("This contact is saved successfully!"));
    return newContact;
  } catch (error) {
    console.log(clc.red.bgWhite("Failed to save the contact"), error.message);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
