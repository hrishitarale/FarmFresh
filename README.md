
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
  // Go to Firebase Console
  // Create a new project
  // Enable Firestore database
  // Copy your config and paste in firebase.jsnpm run dev

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
- Home Page
![{F8BF61A8-1548-4825-A7B7-1E2C7A83748A}](https://github.com/user-attachments/assets/ceb54d59-20c2-484f-9df2-a46d17718c59)
![{0D1FE268-6FC3-41AF-8595-A0A27FFE6AC6}](https://github.com/user-attachments/assets/2c4a45e1-9330-4fe9-a5db-c9cdeb0bdd75)

- Registration Page
![{0FA271A5-B25F-4261-9F76-1CE84C8D7D4B}](https://github.com/user-attachments/assets/c2d0c7ca-aa63-4f5a-aa6c-5f41348a8610)

- Login Page
![{F4D3A279-B1E9-4ABD-AC5B-C3A2471825E2}](https://github.com/user-attachments/assets/aee6b7e1-f7a6-4df7-85bb-d8cc29bc9a2c)

- Farmer's Market
![{95F0E60E-978A-4613-9EB6-0849C744342A}](https://github.com/user-attachments/assets/b448ef42-6aae-41b3-93b8-76b87c3f3cb2)
![{99E8E726-4E23-469B-B854-0C71C7630178}](https://github.com/user-attachments/assets/bb79c572-fce5-4308-b0d6-378214174550)

- Copped Vegetables
![{F7B33891-64D1-44A0-9F86-6322BA873378}](https://github.com/user-attachments/assets/4f2cdb24-1beb-4518-b3fa-0d208e2e6290)

- Cart Page
![{4552F721-ED66-4F23-8C80-C659A9695D97}](https://github.com/user-attachments/assets/0ca9cb8e-0f75-40c2-a348-4e50ecdbd6cb)

- Farmer Dashboard
![{1EBE129B-6026-4AD4-AA82-66020EC67A71}](https://github.com/user-attachments/assets/e134259d-8625-43ff-be10-defa0d78c3cf)
![{DBE2AA76-EBA1-45B4-8890-8017F799BF4E}](https://github.com/user-attachments/assets/e5fa5553-449b-401c-8265-73a8943e8cc2)

- Business Dashboard
![{73BA0D0E-57CE-4A22-A540-8554DDB557F7}](https://github.com/user-attachments/assets/11036cae-3ab9-43cf-870a-4d8a9bfc54f0)

- Community Forum
![{89771710-F989-43FC-82F2-A1F346EF492D}](https://github.com/user-attachments/assets/0ba55030-0037-4ef0-8f9e-eee9744c5b93)

- Admin Dashboard
![{A984A43D-864A-49D0-AEE9-2BA709B77916}](https://github.com/user-attachments/assets/95f9bd75-1125-4237-8290-f6a371d4ec9e)
![{FEDF1767-4D10-415B-9ED9-1E729381A641}](https://github.com/user-attachments/assets/19bafdd0-3b2d-4ae3-aa43-69e6fded9313)
![{7A48A869-8D2E-4958-B7A5-66A2DFBBB1C5}](https://github.com/user-attachments/assets/16726c45-1e54-438f-888b-457e63102fc3)
![{663DAA97-7561-41BE-B289-606939F2CA9B}](https://github.com/user-attachments/assets/76444645-8304-4838-a73f-b5777715bec3)



