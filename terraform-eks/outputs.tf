output "cluster_name" {
  description = "EKS cluster name."
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint."
  value       = module.eks.cluster_endpoint
}

output "cluster_region" {
  description = "AWS region."
  value       = var.aws_region
}

output "node_group_name" {
  description = "Managed node group name."
  value       = module.eks.node_group_name
}

output "vpc_id" {
  description = "VPC ID."
  value       = module.network.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs."
  value       = module.network.public_subnet_ids
}

output "configure_kubectl" {
  description = "Command to configure kubectl for this EKS cluster."
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}

output "argocd_namespace" {
  description = "Namespace where Argo CD is installed."
  value       = var.install_argocd ? var.argocd_namespace : null
}

output "argocd_port_forward" {
  description = "Command to open the Argo CD UI locally."
  value       = var.install_argocd ? "kubectl port-forward svc/argocd-server -n ${var.argocd_namespace} 8080:443" : null
}
