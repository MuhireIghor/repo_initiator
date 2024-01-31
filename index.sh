#!/bin/bash

read -rp "Enter your github username: " github_username
read -rp "Enter your github personal access token: " github_personal_access_token
read -rp "Enter your repository name: " repository_name
read -rp "Enter your project directory: " project_directory
repo_Initiator (){
    local githubUsername=$github_username
    local githubPersonalAccessToken=$github_personal_access_token
    local repositoryName=$repository_name
    local projectDirectory=$project_directory
    # Local folder information
    local_folder="${project_directory}"

    #GitHub API URL
    github_api_url="https://api.github.com/user/repos"

    # Create a new repository on GitHub
    echo "Creating a new repository on GitHub..."
    response=$(curl -s -u "$githubUsername:$githubPersonalAccessToken" "$github_api_url" -d "{\"name\":\"$repositoryName\"}")
    repo_link="https://github.com/$githubUsername/$repositoryName.git"

    # Check if the repository creation was successful
    if [ -z "$repo_link" ]; then
        echo "Failed to create the GitHub repository."
        exit 1
    fi

    # Create a local folder
    echo "Creating a local folder..."
    mkdir "$local_folder"

    # Initialize the local repository
    echo "Initializing the local repository..."
    cd "$local_folder" || exit 1
    git init

    # Add a remote origin to the local repository
    echo "Adding a remote origin..."
    echo "$repo_link"
    git remote add origin "$repo_link"

    echo "Task completed successfully."

}
repo_Initiator



