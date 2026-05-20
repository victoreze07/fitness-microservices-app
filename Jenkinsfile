def runCmd(command) {
  if (isUnix()) {
    sh command
  } else {
    bat command
  }
}

def services = [
  [key: 'frontend', image: 'fitness-frontend', context: 'frontend', deployment: 'frontend', container: 'frontend'],
  [key: 'workout', image: 'workout-service', context: 'services/workout-service', deployment: 'workout-service', container: 'workout-service'],
  [key: 'nutrition', image: 'nutrition-service', context: 'services/nutrition-service', deployment: 'nutrition-service', container: 'nutrition-service'],
  [key: 'progress', image: 'progress-service', context: 'services/progress-service', deployment: 'progress-service', container: 'progress-service']
]

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  parameters {
    string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'Optional registry namespace, for example docker.io/your-user or ghcr.io/your-user.')
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Optional image tag. Empty uses the Jenkins build number.')
    booleanParam(name: 'PUSH_IMAGES', defaultValue: false, description: 'Push images to the Docker registry.')
    booleanParam(name: 'DEPLOY_TO_K8S', defaultValue: false, description: 'Deploy the application to Kubernetes.')
  }

  environment {
    DOCKER_CREDENTIALS_ID = 'docker-registry-credentials'
    KUBECONFIG_CREDENTIALS_ID = 'fitness-kubeconfig'
    K8S_NAMESPACE = 'fitness'
  }

  stages {
    stage('Validate') {
      steps {
        script {
          runCmd('node --check frontend/server.js')
          runCmd('node --check frontend/public/app.js')
          runCmd('node --check services/workout-service/server.js')
          runCmd('node --check services/nutrition-service/server.js')
          runCmd('node --check services/progress-service/server.js')
          runCmd('docker compose config')
        }
      }
    }

    stage('Build Images') {
      steps {
        script {
          env.RESOLVED_IMAGE_TAG = params.IMAGE_TAG?.trim() ? params.IMAGE_TAG.trim() : env.BUILD_NUMBER
          env.RESOLVED_REGISTRY = params.DOCKER_REGISTRY?.trim()
          env.REGISTRY_HOST = env.RESOLVED_REGISTRY ? env.RESOLVED_REGISTRY.tokenize('/')[0] : ''

          services.each { service ->
            def localImage = "${service.image}:${env.RESOLVED_IMAGE_TAG}"
            runCmd("docker build -t ${localImage} ${service.context}")

            if (env.RESOLVED_REGISTRY) {
              runCmd("docker tag ${localImage} ${env.RESOLVED_REGISTRY}/${localImage}")
            }
          }
        }
      }
    }

    stage('Push Images') {
      when {
        expression { return params.PUSH_IMAGES }
      }
      steps {
        script {
          if (!env.RESOLVED_REGISTRY) {
            error('DOCKER_REGISTRY is required when PUSH_IMAGES is enabled.')
          }

          docker.withRegistry("https://${env.REGISTRY_HOST}", env.DOCKER_CREDENTIALS_ID) {
            services.each { service ->
              runCmd("docker push ${env.RESOLVED_REGISTRY}/${service.image}:${env.RESOLVED_IMAGE_TAG}")
            }
          }
        }
      }
    }

    stage('Deploy To Kubernetes') {
      when {
        expression { return params.DEPLOY_TO_K8S }
      }
      steps {
        script {
          withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
            runCmd('kubectl apply -f k8s/')

            services.each { service ->
              def image = env.RESOLVED_REGISTRY
                ? "${env.RESOLVED_REGISTRY}/${service.image}:${env.RESOLVED_IMAGE_TAG}"
                : "${service.image}:${env.RESOLVED_IMAGE_TAG}"
              runCmd("kubectl -n ${env.K8S_NAMESPACE} set image deployment/${service.deployment} ${service.container}=${image}")
              runCmd("kubectl -n ${env.K8S_NAMESPACE} rollout status deployment/${service.deployment} --timeout=120s")
            }
          }
        }
      }
    }
  }

  post {
    success {
      echo "Fitness pipeline completed successfully with image tag ${env.RESOLVED_IMAGE_TAG}."
    }
    failure {
      echo 'Fitness pipeline failed. Check the stage logs above for the exact command that failed.'
    }
  }
}
