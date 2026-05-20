# Fitness Microservices

A small Node.js fitness website split into four services:

- `frontend`: serves the website and proxies API calls to the backend services.
- `workout-service`: workout plans and exercises.
- `nutrition-service`: meal plans and nutrition summaries.
- `progress-service`: progress metrics and milestones.

The project can run locally with Docker Compose or deploy to Kubernetes.

## Run With Docker Compose

```powershell
docker compose up --build
```

Open:

```text
http://localhost:3000
```

Pages:

```text
http://localhost:3000/
http://localhost:3000/workouts
http://localhost:3000/nutrition
http://localhost:3000/progress
```

Health checks:

```text
http://localhost:3000/health
http://localhost:4001/health
http://localhost:4002/health
http://localhost:4003/health
```

## Deploy To Kubernetes

Build the images first. If you use Minikube, run `minikube docker-env` and point your shell at Minikube's Docker daemon before building.

```powershell
docker build -t fitness-frontend:latest ./frontend
docker build -t workout-service:latest ./services/workout-service
docker build -t nutrition-service:latest ./services/nutrition-service
docker build -t progress-service:latest ./services/progress-service
```

Apply the manifests:

```powershell
kubectl apply -f k8s/
```

Check status:

```powershell
kubectl get pods -n fitness
kubectl get services -n fitness
```

For Minikube:

```powershell
minikube service frontend -n fitness
```

For other local clusters, port-forward:

```powershell
kubectl port-forward service/frontend 3000:3000 -n fitness
```

Then open:

```text
http://localhost:3000
```

## Service URLs

Inside Docker Compose and Kubernetes, the frontend talks to the services by DNS name:

- `http://workout-service:4001`
- `http://nutrition-service:4002`
- `http://progress-service:4003`

Those values are configured with environment variables in `docker-compose.yml` and `k8s/frontend.yaml`.

## Jenkins Pipeline

This repo includes a `Jenkinsfile` for CI/CD.

Pipeline stages:

- Validate Node.js files with `node --check`.
- Validate Docker Compose with `docker compose config`.
- Build Docker images for the frontend and all three services.
- Optionally push images to a Docker registry.
- Optionally deploy and update Kubernetes deployments.

Jenkins agent requirements:

- Git
- Node.js 18 or newer
- Docker CLI with Docker daemon access
- Docker Compose plugin
- kubectl, if deploying to Kubernetes
- Jenkins Docker Pipeline plugin

Recommended Jenkins credentials:

```text
docker-registry-credentials
fitness-kubeconfig
```

`docker-registry-credentials` should be a username/password credential for Docker Hub, GitHub Container Registry, or your preferred registry.

`fitness-kubeconfig` should be a secret file credential containing the kubeconfig Jenkins should use for deployment.

Typical Jenkins build parameters:

```text
DOCKER_REGISTRY=docker.io/your-username
IMAGE_TAG=latest
PUSH_IMAGES=true
DEPLOY_TO_K8S=true
```

For a local-only build, leave `DOCKER_REGISTRY` empty and keep `PUSH_IMAGES` and `DEPLOY_TO_K8S` unchecked.
