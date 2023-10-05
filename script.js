const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

// Function to read and update XML file
function updateXmlFile(filePath, phoneNumber, newFirstName, newLastName) {
    const xmlData = fs.readFileSync(filePath, 'utf8');

    // Parse XML data
    xml2js.parseString(xmlData, { explicitArray: false, mergeAttrs: true }, (err, result) => {
        if (err) {
            console.error(`Error parsing XML file ${filePath}: ${err.message}`);
            return;
        }

        // Update the data
        if (result.AddressBook && result.AddressBook.Contact) {
            const contacts = Array.isArray(result.AddressBook.Contact)
                ? result.AddressBook.Contact
                : [result.AddressBook.Contact];

            contacts.forEach(contact => {
                if (contact.Phone && contact.Phone.phonenumber === phoneNumber) {
                    contact.FirstName = newFirstName;
                    contact.LastName = newLastName;
                }
            });
        }

        // Convert data back to XML
        const builder = new xml2js.Builder();
        const updatedXmlData = builder.buildObject(result);

        // Write the updated data back to the file
        fs.writeFileSync(filePath, updatedXmlData, 'utf8');
        console.log(`Updated ${filePath}`);
    });
}

// Function to update all XML files in a folder
function updateXmlFilesInFolder(folderPath, phoneNumber, newFirstName, newLastName) {
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
        const filePath = path.join(folderPath, file);

        // Check if the file has a .xml extension
        if (path.extname(filePath).toLowerCase() === '.xml') {
            updateXmlFile(filePath, phoneNumber, newFirstName, newLastName);
        }
    });
}

// Example usage
const folderPath = 'E:/Front end/Practise/list-ruler';
const phoneNumberToUpdate = '9379992'; // Replace with the desired phone number
const newFirstName = 'Valentyna';
const newLastName = 'Pomada';

updateXmlFilesInFolder(folderPath, phoneNumberToUpdate, newFirstName, newLastName);
