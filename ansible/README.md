# Jenkins Server Ansible Setup

This Ansible playbook configures an Ubuntu EC2 instance as the Jenkins server for this project.

It installs:

- Java 21
- Jenkins
- Git
- Docker Engine
- Docker Compose plugin
- Node.js
- Trivy
- kubectl
- Terraform
- AWS CLI
- SonarScanner
- SonarQube server, optional, running as Docker container on port 9000

The playbook uses the current Jenkins Debian repository signing key:

```text
https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key
```

Jenkins currently requires Java 21 or newer. The playbook installs Eclipse Temurin 21 from the Adoptium apt repository:

```text
https://packages.adoptium.net/artifactory/deb
```

## EC2 Requirements

Recommended EC2 instance:

```text
Ubuntu 22.04 LTS
t3.medium or larger
20+ GiB disk
```

Security group inbound rules:

```text
22/tcp    SSH from your IP
8080/tcp  Jenkins from your IP
9000/tcp  SonarQube, only if you run SonarQube on the same server
```

## Prepare Inventory

From the project root:

```bash
cp ansible/inventory.ini.example ansible/inventory.ini
```

Edit `ansible/inventory.ini`:

```ini
[jenkins]
jenkins-server ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/YOUR_KEY.pem
```

## Run The Playbook

Install Ansible on your control machine first. On Ubuntu or WSL:

```bash
sudo apt update
sudo apt install -y ansible
```

Check the playbook syntax:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml --syntax-check
```

Run the playbook:

```bash
ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

## Open Jenkins

Open:

```text
http://YOUR_EC2_PUBLIC_IP:8080
```

Get the initial admin password:

```bash
ssh -i ~/.ssh/YOUR_KEY.pem ubuntu@YOUR_EC2_PUBLIC_IP
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

## Open SonarQube

The playbook runs SonarQube in Docker by default:

```text
http://YOUR_EC2_PUBLIC_IP:9000
```

The SonarQube Docker image is pinned in `ansible/group_vars/jenkins.yml`:

```yaml
sonarqube_image: sonarqube:26.5.0.122743-community
```

SonarQube can take a few minutes to finish starting after the container is created.

Default login:

```text
admin
admin
```

If you do not want SonarQube on this server, set this in `ansible/group_vars/jenkins.yml`:

```yaml
install_sonarqube_server: false
```

## Jenkins Setup After Playbook

The playbook installs the Jenkins plugins listed in:

```text
ansible/group_vars/jenkins.yml
```

It also writes the plugin reference list to the server:

```text
/var/lib/jenkins/fitness-plugins.txt
```

Installed plugins include:

- Pipeline
- Git
- Credentials Binding
- Docker Pipeline
- SonarScanner CLI
- Blue Ocean
- Job DSL
- Configuration as Code
- Workspace Cleanup

Then configure Jenkins tools:

- Secret text credential name for the SonarQube token: `sonarqube-token`
- Pipeline parameter for the SonarQube URL: `SONAR_HOST_URL`

Those names match the `Jenkinsfile`.

## AWS Access For Jenkins

To let Jenkins deploy to EKS or run Terraform, configure AWS credentials on the server or attach an IAM role to the EC2 instance.

Recommended for EC2:

```text
Attach an IAM role to the Jenkins EC2 instance.
```

For a learning setup, you can also run:

```bash
sudo -iu jenkins aws configure
```

as the `jenkins` user.
