@echo off

set githubUsername=%1
set githubPersonalAccessToken=%2
set repositoryName=%3
set projectDirectory=%4

call :repo_Initiator %githubUsername% %githubPersonalAccessToken% %repositoryName% %projectDirectory%
goto :eof

:repo_Initiator
setlocal
set "githubUsername=%1"
set "githubPersonalAccessToken=%2"
set "repositoryName=%3"
set "projectDirectory=%4"

:: Local folder information
set "local_folder=%projectDirectory%"


:: GitHub API URL
set "github_api_url=https://api.github.com/user/repos"

:: Create a new repository on GitHub
echo Creating a new repository on GitHub...
curl -s -u "%githubUsername%:%githubPersonalAccessToken%" "%github_api_url%" -d "{\"name\":\"%repositoryName%\"}"
set "repo_link=https://github.com/%githubUsername%/%repositoryName%.git"

:: Check if the repository creation was successful
if not defined repo_link (
    echo Failed to create the GitHub repository.
    exit /b 1
)

:: Create a local folder
echo Creating a local folder...
mkdir "%local_folder%"

:: Initialize the local repository
echo Initializing the local repository...
cd /d "%local_folder%" || exit /b 1
git init

:: Add a remote origin to the local repository
echo Adding a remote origin...
echo %repo_link%
git remote add origin "%repo_link%"

echo Task completed successfully.
endlocal
goto :eof
