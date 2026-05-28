variable "project_name" {
  description = "Name used for AWS resource names."
  type        = string
}

variable "cluster_name" {
  description = "EKS cluster name used for Kubernetes subnet tags."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
}

variable "public_subnet_cidrs" {
  description = "Public subnet CIDR blocks."
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to resources."
  type        = map(string)
}
