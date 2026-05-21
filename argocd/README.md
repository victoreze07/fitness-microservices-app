# Argo CD Setup

These manifests connect Argo CD to the Kubernetes manifests in `k8s/`.

Before applying, edit `argocd/fitness-application.yaml` and replace:

```text
https://github.com/YOUR_GITHUB_USERNAME/fitness-microservices.git
```

with your real GitHub repository URL.

## Install Argo CD

```powershell
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait for Argo CD:

```powershell
kubectl get pods -n argocd
```

## Apply This App

```powershell
kubectl apply -f argocd/fitness-project.yaml
kubectl apply -f argocd/fitness-application.yaml
```

Check the application:

```powershell
kubectl get applications -n argocd
kubectl describe application fitness-microservices -n argocd
```

## Open Argo CD UI

```powershell
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Open:

```text
https://localhost:8080
```

Get the initial admin password:

```powershell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}"
```

Decode the password:

```powershell
[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("PASTE_BASE64_PASSWORD_HERE"))
```

## Jenkins With Argo CD

When using Argo CD, Jenkins should usually build and push images only:

```text
PUSH_IMAGES=true
DEPLOY_TO_K8S=false
```

Argo CD handles cluster deployment by syncing the manifests from GitHub.

## Image Names

For a real cluster, update the image values in `k8s/*.yaml` to match your registry images, for example:

```text
docker.io/your-dockerhub-username/fitness-frontend:latest
docker.io/your-dockerhub-username/workout-service:latest
docker.io/your-dockerhub-username/nutrition-service:latest
docker.io/your-dockerhub-username/progress-service:latest
```

If the images stay as local names like `fitness-frontend:latest`, Kubernetes can only run them when those images already exist inside the cluster node runtime.
