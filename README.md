# Chapter & Co. Online Bookstore

A responsive, front-end bookstore demo built with separate HTML, CSS, and JavaScript files. Books, cart contents, orders, and demo users are stored in your browser's `localStorage`.

## Run it

Open `index.html` directly in a modern browser. No installation, server, or build step is required. Google Fonts, Font Awesome icons, SweetAlert2 notifications, and remote cover images load from CDNs and need an internet connection.

## Accounts

Open **Login / Sign Up** in the navigation and choose **Sign Up** to create a client account with a name, email, phone, and password. Email addresses must be unique. Passwords are saved as SHA-256 hashes; the active `currentUser` record does not contain a password.

To create an administrator, select **Admin** in the account type options and enter the admin verification password. The default `ADMIN_SECRET_CODE` is `BOOKSTORE-ADMIN-2025`; change the constant near the top of `js/data.js` to use a different code. The admin's personal password is the password entered in the normal password field, and is used for future logins.

## Local demo limits

This is a front-end demonstration, not secure production authentication. Accounts and password hashes are stored in the current browser's localStorage. Checkout simulates order placement and does not collect payment.

## Notes

Use **Reset demo data** in the admin dashboard to restore the sample catalog and clear accounts, orders, and carts in this browser.
