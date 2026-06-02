variable "aws_region" {
  description = "AWS region where the Jenkins EC2 instance will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for tags and resource names."
  type        = string
  default     = "fitness"
}

variable "instance_name" {
  description = "Name tag for the Jenkins EC2 instance."
  type        = string
  default     = "fitness-jenkins-server"
}

variable "instance_type" {
  description = "EC2 instance type for the Jenkins server."
  type        = string
  default     = "c5a.xlarge"
}

variable "ubuntu_version" {
  description = "Ubuntu LTS version for the Jenkins server AMI."
  type        = string
  default     = "22.04"
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name used for SSH."
  type        = string
  default     = "dev-ec2"
}

variable "vpc_id" {
  description = "Existing VPC ID. Leave empty to use the default VPC."
  type        = string
  default     = ""
}

variable "subnet_id" {
  description = "Existing public subnet ID. Leave empty to use a default VPC subnet."
  type        = string
  default     = ""
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to SSH into the Jenkins server."
  type        = string
  default     = "0.0.0.0/0"
}

variable "allowed_web_cidr" {
  description = "CIDR allowed to access Jenkins and optional SonarQube web ports."
  type        = string
  default     = "0.0.0.0/0"
}

variable "root_volume_size" {
  description = "Root EBS volume size in GiB."
  type        = number
  default     = 40
}

variable "associate_public_ip_address" {
  description = "Whether to associate a public IP address with the instance."
  type        = bool
  default     = true
}

variable "tags" {
  description = "Extra tags to apply to resources."
  type        = map(string)
  default     = {}
}
