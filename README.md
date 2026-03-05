# KILIMO AGRICULTURE MARKETPLACE

Kilimo Agrimarket is a website that enables farmers , buyers and agricultural experts to connect and transact easily 

This website allows

Facilitate direct trade between farmers and buyers

Offer expert advice to improve agricultural practices

Enhance Efficiency and communication in the agricultural industry

## PROBLEM STATEMENT

Agriculture supply chains often suffer from:

- Limited direct access between farmers and buyers
- Lack of help and guidance for farmers
- Inneficient communication in the agricultural system

Kilimo agrimarket helps solve these problems by providing a centralized marketplace and communication platform

## TECHNOLOGIES

### FRONTEND

![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)

![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)

![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)


### BACKEND

![Django](https://img.shields.io/badge/Django-%23092E20.svg?logo=django&logoColor=white)

![Postgres](https://img.shields.io/badge/Postgres-%23316192.svg?logo=postgresql&logoColor=white)


### DEPLOYMENT

![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-%23000000.svg?logo=vercel&logoColor=white)

## FEATURES

1. Account creation and Role Based Access

- The app offers a powerful authentication built on Django's robust authentication system

2. Farmer Produce Dashboard

- A farmers dashboard where farmers can create their harvest produce, see the produce they created, get orders
placed on their produce

- Farmers can also get into contact with field officers , and create report requests to get help on how to increase their productivity

3. Buyer Marketplace Dashboard

- Buyers can place orders directly , wait for the farmers to accept or reject their orders and complete payments on delivery of their products

4. Field Officers Dashboard

- Field Officers can create their services they provide and farmers can browse and contact them for help, helping both connect and offer services

5. Chat

- The app includes a chat messaging system built with django channels and redis and hosted on upstash

- It offers real time communication between the farmers and the buyers to get in touch on the sales process anf farmers to field officers so that the field officers can provide help to the farmers 

## INSTALLATION, SETUP AND CLONING

Follow These Steps to run the frontend locally

1. Clone the repository

```git
git clone https://github.com/Ianmwia/agrimarketplace-app-react-frontend.git
```


2. Install dependencies

```git
npm install
```

3. Environnmet Variables 

Create a ```.env`` file in the root

```git
VITE_API_BASE_URL = http:// localhost:8000/api
VITE_WS_URL = ws://localhost:8000/ws
```
These variables allow the frontend to commminicate with the django backend and websocket server

4. Start the development Server

```git
npm run dev
```

## FOLDER STRUCTURE

```
.
├── chat/
│   ├── ChatBoard.jsx
├── components/
│   ├── Navbar.jsx
├── components/
│   ├── dashboards/
│       ├── farmerspages/
│       ├── fieldofficerspages/
├── pages/
│   ├── Home.jsx
│   ├── LoginForm.jsx
│   ├── Profile.jsx
│   ├── SignupForm.jsx
├── src/
│   ├── assets/      
│   ├── components/      #shadcn components    
│   └── context/         
│   └── lib/  
│   └── Routes/      
│   └── api.js          #entry point of the api from backend         
│   └── App.css          
│   └── index.css         
│   └── main.jsx                      
├── jsconfig.js
├── package.json     
├── vercel.json      
└── vite.config.js
```

## CONTRIBUTION

Contributions are Welcome

To Contribute

1. Fork The repository

2. Create a new feature branch

```git
git checkout -b feature/your-feature
```

3. Commit You Changes

```git
git commit -m 'Add new feature'
```

4.Push Your branch

```git
git push origin feature/your-feature
```

5. Open A pull request

## Issues

If you encounter any bugs or have  queries 

You can open an issue

[Open an Issue](https://github.com/Ianmwia/agrimarketplace-app-react-frontend/issues)