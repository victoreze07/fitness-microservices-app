terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket = "eze-fitness-app-s3"
    key    = "fitness/jenkins-ec2/terraform.tfstate"
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
  }
}
