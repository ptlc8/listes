pipeline {
    agent any

    parameters {
        string(name: 'REPLICAS', defaultValue: params.REPLICAS ?: null, description: 'Nombre de replicas')
    }

    stages {
        stage('Build') {
            steps {
                sh 'docker compose build'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker compose up --remove-orphans -d'
            }
        }
    }
}
