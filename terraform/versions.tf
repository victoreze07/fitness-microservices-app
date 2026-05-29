terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket = "eze-fitness-app-s3"
    key    = "fitness/eks/terraform.tfstate"
    region = "us-east-1"

    # Uncomment this after creating the DynamoDB table for state locking.
    # dynamodb_table = "terraform-state-locks"

    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.13"
    }
  }
}
