@echo off
set githubUsername=%1
set githubPersonalAccessToken=%2
set repositoryName=%3
set projectDirectory=%4

call :repo_Initiator %githubUsername% %githubPersonalAccessToken% %repositoryName% %projectDirectory%
goto :eof

:repo_Initiator
rem Local folder information
set local_folder=%4

rem GitHub API URL
set github_api_url=https://api.github.com/user/repos

rem Create a new repository on GitHub
echo Creating a new repository on GitHub...
curl -s -u %githubUsername%:%githubPersonalAccessToken% %github_api_url% -d "{\"name\":\"%repositoryName%\"}" > temp.txt
set /p repo_link=<temp.txt
del temp.txt

rem Check if the repository creation was successful
if not defined repo_link (
    echo Failed to create the GitHub repository.
    exit /b 1
)

if not exist %local_folder% (
    rem Create a local folder
    echo Creating a local folder...
    mkdir %local_folder%
)

rem Initialize the local repository
echo Initializing the local repository...
cd %local_folder% || exit /b 1
git init

rem Add a remote origin to the local repository
echo Adding a remote origin...
echo %repo_link%
git remote add origin %repo_link%

echo Task completed successfully.
exit /b 0
