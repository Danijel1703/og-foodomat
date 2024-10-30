# OG-FOODOMAT

OG-FOODOMAT is a small food ordering app that simplifies process of creating orders.

## Features

### User Authentication
- Users are able to register and log in
- Unauthorized users can only view venues and menus.

### Venue
- Creating and editing venues

### Menu
- Creating menus for specific venue.
- Each menu item can specific size variants and extras

### Order
- Creating orders
- Only the order admin can change order steps
- Order is updated automatically for all users using realtime database which uses sockets in
  the background
#### Order steps 
1. Venue select
   - Users can submit their vote for the venue they wish to order from, the order admin picks
     the final decision and clicks next
2. Meal select
   - Users submit the meal they would like to order
   - After submitting the meal, until the order admin continues the order users will only see
     a preview of their specific order and their meal total price
3. Order Summary
   - Order summary is the total summary of all user orders and their prices

## Local setup

1. Run `npm i` to install necessary node dependencies
2. Install Java version 17 or higher (This is needed for firebase emulator)
3. Run `npm install -g firebase-tools` to install firebase CLI
4. Run `firebase init emulators`
   Select: 
   - Firebase Authentication (Port: 5000)
   - Realtime Database (Port: 5001)
   - Firebase Storage (Port: 5002)
5. Run `firebase emulators:start` to start the emulators
6. Run `npm run dev` and the app should be up and running
