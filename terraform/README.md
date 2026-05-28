# EKS Terraform

This Terraform configuration creates:

- One VPC
- Two public subnets
- Internet gateway and public route table
- EKS cluster
- One EKS managed node group
- Core EKS add-ons: VPC CNI, kube-proxy, and CoreDNS
- Argo CD installed with Helm, when `install_argocd = true`

This setup is designed for a simple development cluster. It uses public subnets to avoid NAT gateway cost. For production, use private node subnets and a more locked-down networking model.

## Layout

```text
terraform/
  versions.tf
  providers.tf
  variables.tf
  locals.tf
  data.tf
  main.tf
  outputs.tf
  terraform.tfvars.example

  modules/
    network/
      main.tf
      variables.tf
      outputs.tf
    eks/
      iam.tf
      main.tf
      addons.tf
      variables.tf
      outputs.tf
    argocd/
      main.tf
      variables.tf
      outputs.tf
```

The root module wires the child modules together. The child modules contain the actual resource blocks.

## Prerequisites

- AWS CLI
- Terraform
- kubectl
- AWS credentials configured locally

Check your tools:

```powershell
aws --version
terraform version
kubectl version --client
aws sts get-caller-identity
```

## Create The Cluster

```powershell
cd terraform
Copy-Item terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

## Configure kubectl

After apply completes, run the command from the `configure_kubectl` Terraform output.

Example:

```powershell
aws eks update-kubeconfig --region us-east-1 --name fitness-eks
kubectl get nodes
```

## Open Argo CD

Argo CD is installed by default. To disable it, set this in `terraform.tfvars`:

```hcl
install_argocd = false
```

To open the Argo CD UI, run the command from the `argocd_port_forward` Terraform output.

Example:

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

## Deploy The Fitness App

From the project root:

```powershell
kubectl apply -f k8s/
```

## Destroy The Cluster

From the `terraform` folder:

```powershell
terraform destroy
```
