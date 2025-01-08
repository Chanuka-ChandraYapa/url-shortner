# URL Shortener - Kubernetes Mini Project

This repository contains a **URL Shortener application** designed and developed as a **mini project** to explore and understand key **Kubernetes concepts**. The project involves both frontend and backend services, Dockerized applications, and Kubernetes deployments for learning container orchestration and cluster management.

---

## **Project Overview**

The URL Shortener application allows users to:
1. **Shorten URLs**: Convert a long URL into a shorter, shareable link.
2. **Expand URLs**: Retrieve the original URL using the shortened link.

The application is designed with:
- A **Node.js** backend (alternative available in Golang).
- A **frontend** built with HTML, CSS, and JavaScript.
- **Dockerized microservices** for deployment.
- **Kubernetes configuration** to deploy and manage the application on a cluster.

---

## **Key Features**

- RESTful API for shortening and expanding URLs.
- User-friendly frontend with light/dark mode toggle.
- Cross-Origin Resource Sharing (CORS) enabled for secure communication between frontend and backend.
- Robust URL generation and validation methods.
- Fully containerized application using Docker.
- Kubernetes manifests for deployment, service, and load balancing.

---

## **Learning Objectives**

This mini project was undertaken with the following goals:
- Gain hands-on experience with **Kubernetes concepts** such as deployments, services, and pods.
- Understand the process of **Dockerizing applications** for containerized environments.
- Learn to manage and scale applications in a Kubernetes cluster.
- Improve skills in orchestrating multi-container applications.

---

## **Project Structure**

```plaintext
url-shortener/
├── backend/
│   ├── Dockerfile         # Dockerfile for the backend service
│   ├── server.js          # Backend logic (Node.js)
│   ├── package.json       # Dependencies and scripts
│   └── routes/            # API route handlers
├── frontend/
│   ├── Dockerfile         # Dockerfile for the frontend service
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styling for the application
│   └── main.js            # Frontend logic
├── kubernetes/
│   ├── backend-deployment.yml  # Deployment for the backend
│   ├── frontend-deployment.yml # Deployment for the frontend
│   ├── backend-service.yml     # Service for the backend
│   ├── frontend-service.yml    # Service for the frontend
├── README.md              # Documentation
└── .gitignore             # Git ignore rules
```

## **Prerequisites**
- Docker: Ensure Docker is installed and running.
- Kubernetes: Set up a Kubernetes cluster (e.g., Minikube or managed services like GKE).
- kubectl: Command-line tool for Kubernetes.

## **Setup and Deployment**
- Step 1: Dockerize Applications

Build Docker images for the frontend and backend:
```bash
docker-compose build -t url-shortener-backend ./backend
docker-compose build -t url-shortener-frontend ./frontend
```
- Step 2: Kubernetes Deployment

Apply the Kubernetes manifests:
```bash
kubectl apply -f kubernetes/backend-deployment.yml
kubectl apply -f kubernetes/frontend-deployment.yml
```
- Step 3: Access the Application

Use kubectl port-forward or a LoadBalancer service to access the application. Example for frontend access:
```bash
kubectl port-forward service/frontend-service 8080:80
```

Navigate to http://localhost:8080 in your browser.

## **Future Enhancements**
- Add persistent storage for the database using Kubernetes PersistentVolumeClaims (PVC).
- Implement autoscaling for services using Horizontal Pod Autoscaler.
- Deploy the application on a managed Kubernetes service like Google Kubernetes Engine (GKE).

## **Contributions**
Contributions are welcome! Feel free to submit issues or pull requests for improvements.

## **License**
This project is licensed under the MIT License.

## **Contact**
For any queries or suggestions, please feel free to reach out.
