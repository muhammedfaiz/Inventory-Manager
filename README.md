Inventory Manager

This project is an Inventory Manager website designed to manage product sales and customer information efficiently.

Features

- Manage product sales and customer information.
- Record and list sales with product, customer, and payment details.
- View historical sales data with pagination.
- Responsive design with sidebar navigation.

Technologies

- Frontend: React, Shadcn UI, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Miscellaneous: Axios for HTTP requests, Toast for notifications

Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v14+)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or MongoDB Atlas)
- [Git](https://git-scm.com/) (to clone the repository)


Installation

1. Clone the repository:

    bash
    git clone https://github.com/your-username/inventory-manager.git
    

2. Navigate to the project directory:

    bash
    cd inventory-manager
    

3. Install backend dependencies:

    bash
    cd backend
    npm install
    

4. Install frontend dependencies:

    bash
    cd ../frontend
    npm install
    

Running the Application

Backend

1. Create a '.env' file in the 'backend' directory and add the following environment variables:

    bash
    PORT=8000
    MONGO_URI=your_mongo_db_connection_string
    

2. Start the backend server:

    bash
    npm run dev
    

Frontend

1. Start the frontend React application:

    bash
    npm run dev
    

2. Open your browser and go to 'http://localhost:5173' to view the website.



Feel free to give your contribution to the project.