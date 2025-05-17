
# Farm Fresh

FarmFresh is a full-stack web application designed to connect farmers directly with customers and businesses, allowing users to buy fresh vegetables, fruits, and chopped produce while empowering farmers with a platform.

## Features
👩‍🌾 For Farmers
- Register and manage products (name, price, category, image)
- View orders placed by customers for their own products
- Join community forum and post tips/articles

🛒 For Customers
- Browse products in Farmer’s Market
- Add to cart with weight-based options (500 gm, 1 kg, etc.)
- Schedule delivery (slot & date)
- View order summary and place orders

🏢 For Businesses
- Dedicated bulk order dashboard
- Choose from preset quantities (5 kg, 10 kg, 20 kg)
- Receive delivery and invoice support

🧑‍💼 For Admin
- Manage all users (farmers, customers, businesses)
- View all products listed
- Delete/edit users or products
- View all orders
## Tech Stack

**Frontend:** React.js, React Router DOM, CSS

**Backend:** Firebase Firestore

**Build Tool:** Vite




## Installation

Clone the repo

```bash
  git clone https://github.com/your-username/farmfresh.git
  cd farmfresh

```
Install Dependencies

```bash
  npm install

```
Firebase configuration
```bash
  Go to Firebase Console
  Create a new project
  Enable Firestore database
  Copy your config and paste in firebase.jsnpm run dev

  // firebase.js
  import { initializeApp } from "firebase/app";
  import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
  };

  const app = initializeApp(firebaseConfig);
  export const db = getFirestore(app);

```

Start the app

```bash
  npm run dev

```

## Screenshots

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

