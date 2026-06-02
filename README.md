# Fitness Microservices

A small Node.js fitness website split into four services:

- `frontend`: serves the website and proxies API calls to the backend services.
- `workout-service`: workout plans and exercises.
- `nutrition-service`: meal plans and nutrition summaries.
- `progress-service`: progress metrics and milestones.

The project can run locally with Docker Compose or deploy to Kubernetes.

## Infrastructure With Terraform

Terraform files are available in `terraform-eks/` to create an AWS EKS cluster with one managed node group and install Argo CD.

Terraform files for the Jenkins EC2 server are available in `terraform-ec2/`.

```bash
cd terraform-ec2
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

The Jenkins EC2 spec is Ubuntu Linux on `c5a.xlarge`. After the EC2 instance is created, use the Ansible playbook in `ansible/` to install Jenkins and CI tools.

```powershell
cd terraform-eks
Copy-Item terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

After apply, configure kubectl using the Terraform output:

```powershell
aws eks update-kubeconfig --region us-east-1 --name fitness-eks
kubectl get nodes
```

See `terraform-eks/README.md` for the full infrastructure steps.

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

An Ansible playbook for provisioning a Jenkins EC2 server is available in `ansible/`.

```bash
cp ansible/inventory.ini.example ansible/inventory.ini
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

See `ansible/README.md` for the full EC2 setup steps.

Pipeline stages:

- Validate Node.js files with `node --check`.
- Validate Docker Compose with `docker compose config`.
- Run SonarQube code analysis.
- Build Docker images for the frontend and all three services.
- Scan Docker images with Trivy.
- Optionally push images to a Docker registry.
- Optionally deploy and update Kubernetes deployments, or let Argo CD sync the Kubernetes manifests from Git.

Jenkins agent requirements:

- Git
- Node.js 18 or newer
- Docker CLI with Docker daemon access
- Docker Compose plugin
- SonarQube Scanner
- SonarQube Scanner for Jenkins plugin
- Trivy
- kubectl, if deploying to Kubernetes

Recommended Jenkins credentials:

```text
docker-registry-credentials
fitness-kubeconfig
```

`docker-registry-credentials` should be a username/password credential for Docker Hub, GitHub Container Registry, or your preferred registry.

`fitness-kubeconfig` should be a secret file credential containing the kubeconfig Jenkins should use for deployment.

SonarQube Jenkins setup:

- Install the `SonarQube Scanner for Jenkins` plugin.
- Add a SonarQube server in Jenkins named `SonarQube`.
- Add a SonarQube scanner tool in Jenkins named `SonarScanner`.
- Generate a SonarQube token and store it in the Jenkins SonarQube server configuration.
- Optional quality gate waiting requires a SonarQube webhook pointing to `http://JENKINS_URL/sonarqube-webhook/`.

Typical Jenkins build parameters:

```text
DOCKER_REGISTRY=docker.io/your-username
IMAGE_TAG=
RUN_SONARQUBE=true
WAIT_FOR_SONAR_QUALITY_GATE=false
FAIL_ON_TRIVY_FINDINGS=true
PUSH_IMAGES=true
DEPLOY_TO_K8S=true
```

When `IMAGE_TAG` is empty, Jenkins uses the current build number.

The Trivy stage scans every built image and fails on HIGH or CRITICAL vulnerabilities by default. Set `FAIL_ON_TRIVY_FINDINGS=false` only when you want the scan to report findings without blocking the pipeline.

For a local-only build, leave `DOCKER_REGISTRY` empty and keep `PUSH_IMAGES` and `DEPLOY_TO_K8S` unchecked.

For Docker Hub, `DOCKER_REGISTRY` should include your namespace, not only the host:

```text
docker.io/your-dockerhub-username
```

For GitHub Container Registry:

```text
ghcr.io/your-github-username
```

## Argo CD GitOps

This repo includes Argo CD manifests in `argocd/`.

Files:

```text
argocd/fitness-project.yaml
argocd/fitness-application.yaml
argocd/README.md
k8s/kustomization.yaml
```

Before applying Argo CD, edit `argocd/fitness-application.yaml` and replace:

```text
https://github.com/YOUR_GITHUB_USERNAME/fitness-microservices.git
```

with your real GitHub repository URL.

Apply the Argo CD app:

```powershell
kubectl apply -f argocd/fitness-project.yaml
kubectl apply -f argocd/fitness-application.yaml
```

When using Argo CD, set Jenkins like this:

```text
PUSH_IMAGES=true
DEPLOY_TO_K8S=false
```

Jenkins builds and pushes images. Argo CD watches GitHub and syncs the Kubernetes manifests.

For a real cluster, make sure the image fields in `k8s/*.yaml` use pullable registry images, such as:

```text
docker.io/your-dockerhub-username/fitness-frontend:latest
```

Local names like `fitness-frontend:latest` work only when the image already exists inside the cluster node runtime.
