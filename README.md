# **Game of Life Front**

A React + Vite web application that serves as the frontend for the Game of Life. This project is set up with minimal configuration and uses ESLint for linting.

---

## **Table of Contents**
1. [Overview](#overview)
2. [Features](#features)
3. [Running the Project](#running-the-project)
4. [License](#license)
5. [Author](#author)

---

## **Overview**

**Game of Life Front** provides a responsive user interface to interact with Conway’s *Game of Life*. Built with React and Vite, it can communicate with a Ruby on Rails backend for reading and updating game states.

---

## **Features**
- **Interactive Grid**: Render the Game of Life grid and handle user interactions.
- **Live Updates**: Fetch and display data from the backend, reflecting changes in real time.
- **Responsive Design**: Styled for various screen sizes.
- **Docker Support**: Can be containerized to work alongside the Rails backend.

---

## **Setup and Installation**

### **1. Prerequisites**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- (Optional) [Docker](https://docs.docker.com/get-docker/) if using containers

### **2. Clone the Repository**
```bash
  git clone https://github.com/gsimei/game-of-life-front.git
  cd game-of-life-front
```

### **3. Running the Project**
```bash
  VITE_BUILD_MODE=development docker compose up --build
```

To stop

```bash
  docker compose down
```

---

### **4. Licence**
This project is licensed under the MIT License.


### **5. Author**
George Simei

- GitHub: @gsimei
- Email: georgesimei@gmail.com
