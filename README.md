# OpinioNet

OpinioNet is a subscription-based platform that allows users to share their opinions on current news and various topics. The website features an explore page that showcases the latest news articles, enabling users to stay informed while engaging in meaningful discussions.

## Features

- **User Opinions**: Users can post their opinions on current news and other topics, fostering a community of shared thoughts and discussions.
- **Explore Page**: A dedicated page displaying the latest news articles for users to browse.
- **Subscription Model**: OpinioNet operates on a subscription-based model with the following features:
  - Users must subscribe to the platform to be able to post their opinions.
  - Each user has a limit on the number of posts they can make, ensuring fair use of the platform.
  - Payment for subscriptions is handled securely through RazorPay.
  - Users can also pay via an invoice sent to their email, which includes a URL for processing the payment.
  - Notifications are sent to users to inform them of the results of their subscription payments, keeping them updated on their account status.
- **Payment Integration**: Implemented RazorPay for secure payment processing.
- **i18next Localization**: The website supports multiple languages using i18next for language localization. Users must authenticate their email to change the static language.
- **Notifications**: Users receive notifications regarding the results of their subscription payments, ensuring they stay informed about their account status.


## Tech Stack

- **Frontend**: React, i18next
- **Backend**: Node.js, Express, MongoDB

## Environment Variables

### Backend

To configure the backend, you need to set the following environment variables:

- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `RAZORPAY_KEY_ID`: RazorPay key ID
- `RAZORPAY_KEY_SECRET`: RazorPay key secret
- `SMTP_MAIL`: Website email ID
- `SMTP_PASSWORD`: Email password
- `PORT`: Port number for the backend server

### Frontend

To configure the frontend, you need to set the following environment variables:

- `REACT_APP_IMGBB_API_KEY`: API key for storing images
- `REACT_APP_RAZOR_PAY_KEY`: RazorPay key for the frontend
- `REACT_APP_Backend_url`: URL for the backend server
- `REACT_APP_FIREBASE_API_KEY`: Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Firebase measurement ID
- `REACT_APP_NEWS_API`: News API endpoint

## Getting Started

To get started with OpinioNet, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/raghava7129/OpinioNet.git
   cd OpinioNet

2. Go to the `backend` directory and install the dependencies:
   ```bash
   cd Backend
   npm install

3. Create a `.env` file in the `backend` directory and add the required environment variables.

4. Start the backend server:
   ```bash
   npm run start-dev

5. Go to the `frontend` directory and install the dependencies:
   ```bash
    cd frontend
    npm install

6. Create a `.env` file in the `frontend` directory and add the required environment variables.

7. Start the frontend server:
   ```bash
   npm start

8. Open your browser and go to `http://localhost:3000` to view the website.



