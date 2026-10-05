pipeline {
    agent any

    triggers {
        githubPush()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                dir('Backend') {
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('Frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Backend Build') {
            steps {
                sh 'docker build -t hotel-backend:cie ./Backend'
            }
        }

        stage('Docker Frontend Build') {
            steps {
                sh 'docker build -t hotel-frontend:cie ./Frontend'
            }
        }

        stage('Docker Image Verification') {
            steps {
                sh 'docker images hotel-backend:cie'
                sh 'docker images hotel-frontend:cie'
            }
        }

        stage('Load Images into Minikube') {
            steps {
                sh 'minikube image load hotel-backend:cie'
                sh 'minikube image load hotel-frontend:cie'
            }
        }

        stage('Deploy MySQL to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/mysql.yaml'
            }
        }

        stage('Deploy Backend to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/backend.yaml'
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh 'kubectl get deployments'
                sh 'kubectl get pods'
                sh 'kubectl get services'
            }
        }

        stage('Wait for Backend Rollout') {
            steps {
                sh 'kubectl rollout status deployment/backend --timeout=180s'
            }
        }

        stage('Kubernetes Final Verification') {
            steps {
                sh 'kubectl get pods -o wide'
                sh 'kubectl get endpoints backend-service'
            }
        }
    }

    post {
        success {
            echo 'Hotel Management CI/CD Pipeline Successful!'
            echo 'Git -> Jenkins -> Build -> Docker -> Kubernetes completed successfully.'
        }

        failure {
            echo 'Hotel Management CI/CD Pipeline Failed!'
            echo 'Check the failed Jenkins stage and console output.'
        }
    }
}