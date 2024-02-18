@echo off
set githubUsername=%1
set githubPersonalAccessToken=%2
set repositoryName=%3
set projectDirectory=%4
set isRepoPrivate=%5
set projDescription=%6

call :repo_Initiator
exit /b

:repo_Initiator
rem Local folder information
set "local_folder=%projectDirectory%"

rem GitHub API URL
set "github_api_url=https://api.github.com/user/repos"

rem Create a new repository on GitHub
echo Creating a new repository on GitHub...

curl -L -X POST ^
    -H "Accept: application/vnd.github+json" ^
    -H "Authorization: Bearer %githubPersonalAccessToken%" ^
    -H "X-GitHub-Api-Version: 2022-11-28" ^
    "%github_api_url%" ^
    -d "{\"name\": \"%repositoryName%\",\"description\":\"%projDescription%\",\"private\":%isRepoPrivate%}"

set "repo_link=https://github.com/%githubUsername%/%repositoryName%.git"

rem Check if the repository creation was successful
if "%repo_link%"=="" (
    echo Failed to create the GitHub repository.
    exit /b 1
)

if not exist "%local_folder%" (
    rem Create a local folder
    echo Creating a local folder...
    mkdir "%local_folder%"
)

rem Initialize the local repository
echo Initializing the local repository...
cd /d "%local_folder%" || exit /b 1
git init

rem Add a remote origin to the local repository
echo Adding a remote origin...
echo %repo_link%
git remote add origin %repo_link%

echo Task completed successfully.
exit /b
