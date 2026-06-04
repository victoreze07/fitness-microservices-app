variable "project_name" {
  description = "Name used for node group naming."
  type        = string
}

variable "cluster_name" {
  description = "EKS cluster name."
  type        = string
}

variable "cluster_version" {
  description = "Optional EKS Kubernetes version."
  type        = string
}

variable "cluster_admin_principal_arns" {
  description = "IAM user or role ARNs to grant Kubernetes cluster-admin access."
  type        = list(string)
}

variable "cluster_admin_access_policy_arn" {
  description = "EKS access policy ARN to associate with cluster admin principals."
  type        = string
}

variable "public_subnet_ids" {
  description = "Subnet IDs for the EKS cluster and managed node group."
  type        = list(string)
}

variable "node_instance_types" {
  description = "EC2 instance types for the managed node group."
  type        = list(string)
}

variable "node_desired_size" {
  description = "Desired number of worker nodes."
  type        = number
}

variable "node_min_size" {
  description = "Minimum number of worker nodes."
  type        = number
}

variable "node_max_size" {
  description = "Maximum number of worker nodes."
  type        = number
}

variable "node_disk_size" {
  description = "Disk size in GiB for each worker node."
  type        = number
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
}
