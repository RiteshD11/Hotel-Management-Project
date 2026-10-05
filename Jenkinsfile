pipeline {
    agent any

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
    }

    post {
        success {
            echo 'Hotel Management CI Pipeline Successful!'
        }

        failure {
            echo 'Hotel Management CI Pipeline Failed!'
        }
    }
}
