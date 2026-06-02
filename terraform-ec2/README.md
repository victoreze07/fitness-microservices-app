# Jenkins EC2 Terraform

This Terraform folder creates an Ubuntu EC2 instance for the Jenkins server.

Instance spec:

```text
AMI: Ubuntu 22.04 LTS
Type: c5a.xlarge
Disk: 40 GiB gp3
```

It also creates:

- Security group for SSH, Jenkins, and optional SonarQube
- IAM role and instance profile
- SSM managed instance policy
- ECR read-only policy

## Prerequisites

- AWS CLI configured
- Terraform installed
- An existing EC2 key pair in AWS
- S3 bucket for Terraform state: `eze-fitness-app-s3`

Check credentials:

```bash
aws sts get-caller-identity
```

## Create The Server

```bash
cd terraform-ec2
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
key_name = "dev-ec2.pem"

allowed_ssh_cidr = "0.0.0.0/0"
allowed_web_cidr = "0.0.0.0/0"
```

These defaults prevent Terraform from prompting during `plan` or `apply`.

`key_name` must match the key pair name shown in AWS EC2, not necessarily the local file name. If AWS shows the key pair as `dev-ec2`, use `dev-ec2` instead of `dev-ec2.pem`.

SSH still requires your `.pem` private key, but `0.0.0.0/0` means the port is reachable from anywhere. For better security, replace these values with your public IP using `/32`.

Then run:

```bash
terraform init
terraform plan
terraform apply
```

## Connect With SSH

Terraform outputs the public IP.

From WSL, if your `.pem` is in Windows Documents:

```bash
chmod 400 /mnt/c/Users/vezeokonkwo/Documents/YOUR_KEY.pem
ssh -i /mnt/c/Users/vezeokonkwo/Documents/YOUR_KEY.pem ubuntu@EC2_PUBLIC_IP
```

## Run The Jenkins Ansible Playbook

Use the `ansible_inventory_line` Terraform output to update:

```text
ansible/inventory.ini
```

Then from the project root:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --syntax-check
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

## Open Jenkins

After Ansible finishes:

```text
http://EC2_PUBLIC_IP:8080
```
