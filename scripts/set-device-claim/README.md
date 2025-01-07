The script in this directory is used to set a custom claim on a device account in order to allow it to access its data in the database.

## Usage

1. Create an Email/Password user in Firebase whose "e-mail address" is the serial number followed by `@device.smartstrip.invalid`
2. Follow [these instructions](https://firebase.google.com/docs/admin/setup/#initialize_the_sdk_in_non-google_environments) to set Firebase admin credentials
3. Run `./index.js <serial_number>`
