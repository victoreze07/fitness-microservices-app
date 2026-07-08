output "instance_id" {
  description = "Jenkins EC2 instance ID."
  value       = aws_instance.jenkins.id
}

output "public_ip" {
  description = "Jenkins EC2 public IP address."
  value       = aws_instance.jenkins.public_ip
}

output "public_dns" {
  description = "Jenkins EC2 public DNS name."
  value       = aws_instance.jenkins.public_dns
}

output "jenkins_url" {
  description = "Jenkins URL."
  value       = "http://${aws_instance.jenkins.public_ip}:8080"
}

output "sonarqube_url" {
  description = "Optional SonarQube URL if installed on this server."
  value       = "http://${aws_instance.jenkins.public_ip}:9000"
}

output "grafana_url" {
  description = "Optional Grafana URL if exposed through this server."
  value       = "http://${aws_instance.jenkins.public_ip}:3001"
}

output "prometheus_url" {
  description = "Optional Prometheus URL if exposed through this server."
  value       = "http://${aws_instance.jenkins.public_ip}:9090"
}

output "ansible_inventory_line" {
  description = "Inventory line to paste into ansible/inventory.ini."
  value       = "jenkins-server ansible_host=${aws_instance.jenkins.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=/mnt/c/Users/vezeokonkwo/Documents/YOUR_KEY.pem"
}

output "security_group_id" {
  description = "Jenkins security group ID."
  value       = aws_security_group.jenkins.id
}

output "iam_role_name" {
  description = "IAM role attached to Jenkins EC2."
  value       = aws_iam_role.jenkins.name
}
