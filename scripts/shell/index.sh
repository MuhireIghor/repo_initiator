#!/bin/env bash

    githubUsername=$1
    githubPersonalAccessToken=$2
    repositoryName=$3
    projectDirectory=$4

repo_Initiator (){
    # Local folder information
    local_folder="$projectDirectory"

    #GitHub API URL
    github_api_url="https://api.github.com/user/repos"

    # Create a new repository on GitHub
    echo "Creating a new repository on GitHub..."
response=$(curl -L \
  -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $githubPersonalAccessToken" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/user/repos \
  -d "{\"name\": \"$repositoryName\"}")

    echo "$response"
    repo_link="https://github.com/$githubUsername/$repositoryName.git"

    # Check if the repository creation was successful
    if [ -z "$repo_link" ]; then
        echo "Failed to create the GitHub repository."
        exit 1
    fi

    if [ ! -d "$local_folder" ]; then
        # Create a local folder
        echo "Creating a local folder..."
        mkdir -p "$local_folder"
    fi

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
repo_Initiator "$githubUsername" "$githubPersonalAccessToken" "$repositoryName" "$projectDirectory"
