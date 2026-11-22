ChamaPay

ChamaPay helps savings groups (chamas) keep track of contributions. A treasurer adds members, records who has paid and sends payment reminders. Members log in to see what they owe and when it is due.

Live demo: https://eddiemuhia1.github.io/ChamaPay/

Features

Everyone

Sign up and log in with email and password, or with Google
Two roles, treasurer and member, chosen at sign up
Protected pages: only logged-in people can see their dashboard

Treasurer

Names the group when signing up
Sees the total collected, a progress bar and the list of unpaid members
Adds members with a name, email, amount and due date
Marks members as paid
Sends a payment reminder to all unpaid members
Searches and filters the member list, and removes members
Sees the group total in USD, GBP or EUR

Member

Sees their group name, contribution amount and due date
Sees a reminder banner as soon as the treasurer sends one, with no refresh
Sees their contribution in USD, GBP or EUR
How members are linked to their account

When the treasurer adds a member, they type that member's email. The member then signs up with the same email, and the app finds their record automatically.

Tech Stack

React and Vite
Tailwind CSS
React Router
Firebase Authentication and Cloud Firestore
Mocha and Chai for tests
GitHub Actions and GitHub Pages for deployment
API used

Exchange rates come from the ExchangeRate-API open endpoint:

https://open.er-api.com/v6/latest/KES

The app fetches it with fetch in src/components/CurrencyEquivalent.jsx and uses the rates to show amounts in USD, GBP or EUR. Rates by Exchange Rate API.

Data

Users, members and reminders are stored in Cloud Firestore, so everything is still there after a refresh. Treasurers can create, view, update (mark paid, send reminders) and delete members.

Getting started
bash
git clone https://github.com/eddiemuhia1/ChamaPay.git
cd ChamaPay
npm install
npm run dev

Open the address shown in the terminal. It ends in /ChamaPay/.

To run your own copy, create a Firebase project, turn on Email/Password and Google sign-in under Authentication, create a Firestore database, and put your Firebase settings in src/firebase.js.

Tests
bash
npm test

The Mocha tests in the test folder cover the reminder logic, the group name rules, the exchange rate conversion and the rules for removing a member.

Project structure
src/
  components/   dashboard tabs, member and treasurer views, currency display
  context/      AuthContext: who is logged in, their role and group name
  pages/        Login, SignUp and Home
  utils/        small logic functions that the tests check
  firebase.js   Firebase setup
test/           Mocha tests
