const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.join(__dirname, "bd", "contacts.json");
require("colors");

async function getContactById(contactId) {
  const contacts = await getContacts();
  const result = contacts.find((el) => el.id === Number(contactId));

  if (result) {
    return result;
  }

  return console.log(`Contact with id ${contactId} not found`.red);
}

async function removeContact(contactId) {
  const contacts = await getContacts();
  const filteredContacts = contacts.filter((el) => el.id !== Number(contactId));

  if (filteredContacts.length !== contacts.length) {
    const data = JSON.stringify(filteredContacts);
    await fs
      .writeFile(contactsPath, data)
      .then(console.log("Contact removed".green))
      .catch(handleError);
  }

  return;
}

async function addContact(name, email, phone) {
  const contacts = await getContacts();

  if (!contacts.find((el) => el.phone === phone)) {
    contacts.push({ name, email, phone, id: getNewId(contacts) });

    await fs
      .writeFile(contactsPath, JSON.stringify(contacts))
      .then(console.log("Contact created".green))
      .catch(handleError);
  } else {
    console.log("Phone number already exists".yellow);
  }
}

async function getContacts() {
  return await fs
    .readFile(contactsPath)
    .then((data) => JSON.parse(data.toString()))
    .catch(handleError);
}

function handleError(e) {
  console.log("Error".red, e);

  return;
}

function getNewId(arr) {
  const randomNumber = Math.round(Math.random() * 100);
  if (arr.find((el) => el.id === randomNumber)) {
    getNewId(arr);

    return;
  }

  return randomNumber;
}

module.exports = {
  getContactById,
  removeContact,
  addContact,
  getContacts,
};
