variable "aws_region" {
  description = "AWS region where the EKS cluster will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name used for AWS resource tags and generated names."
  type        = string
  default     = "fitness"
}

variable "cluster_name" {
  description = "EKS cluster name. Leave empty to use project_name-eks."
  type        = string
  default     = ""
}

variable "cluster_version" {
  description = "Optional EKS Kubernetes version. Null lets AWS use the provider/API default."
  type        = string
  default     = null
}

variable "vpc_cidr" {
  description = "CIDR block for the EKS VPC."
  type        = string
  default     = "10.40.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks for EKS."
  type        = list(string)
  default     = ["10.40.1.0/24", "10.40.2.0/24"]
}

variable "node_instance_types" {
  description = "EC2 instance types for the managed node group."
  type        = list(string)
  default     = ["t3.medium"]
}

variable "node_desired_size" {
  description = "Desired number of worker nodes."
  type        = number
  default     = 1
}

variable "node_min_size" {
  description = "Minimum number of worker nodes."
  type        = number
  default     = 1
}

variable "node_max_size" {
  description = "Maximum number of worker nodes."
  type        = number
  default     = 2
}

variable "node_disk_size" {
  description = "Disk size in GiB for each worker node."
  type        = number
  default     = 20
}

variable "tags" {
  description = "Extra tags to apply to AWS resources."
  type        = map(string)
  default     = {}
}

variable "install_argocd" {
  description = "Install Argo CD into the EKS cluster with Helm."
  type        = bool
  default     = true
}

variable "argocd_namespace" {
  description = "Namespace where Argo CD will be installed."
  type        = string
  default     = "argocd"
}

variable "argocd_chart_version" {
  description = "Argo CD Helm chart version."
  type        = string
  default     = "7.7.11"
}
