@echo off
set "PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%"
echo Pushing Balaji Motors repository to GitHub...
git push -u origin main
pause