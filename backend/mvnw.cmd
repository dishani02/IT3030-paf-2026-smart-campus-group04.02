@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements. See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership. The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License. You may obtain a copy of the License at
@REM
@REM https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied. See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "__MVNW_ARG0_NAME__=%~nx0")
@SET ___MVNW_UNFUSED_ARGS_=%*

@SETLOCAL
@SET MAVEN_PROJECTBASEDIR=%~dp0
@IF "%MAVEN_PROJECTBASEDIR:~-1%"=="\" SET "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"
@SET MVN_CMD=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\MavenWrapperDownloader.java

@SET MVNW_VERBOSE=false
@IF NOT "%MVNW_VERBOSE%"=="" (
  IF "%MVNW_VERBOSE%"=="true" (SET MVNW_VERBOSE=true)
)

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties"

@SET DOWNLOAD_URL=
@FOR /F "usebackq tokens=1,2 delims==" %%A IN (%WRAPPER_PROPERTIES%) DO (
  @IF "%%A"=="distributionUrl" (SET DOWNLOAD_URL=%%B)
)

@SET MVN_CMD=
@SET JAVA_HOME_LOOKUP=
FOR /F "usebackq tokens=1,2 delims==" %%A IN (%WRAPPER_PROPERTIES%) DO IF "%%A"=="distributionUrl" SET MVN_VER=%%B

IF EXIST %WRAPPER_JAR% (
  SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
  SET LAUNCH_JAR="%WRAPPER_JAR%"
  GOTO launch
)

echo Downloading Maven Wrapper...

:launch
"%JAVA_HOME%\bin\java.exe" ^
  -classpath %WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %WRAPPER_LAUNCHER% ^
  %MAVEN_CONFIG% ^
  %___MVNW_UNFUSED_ARGS_%
IF ERRORLEVEL 1 GOTO error
GOTO end

:error
SET ERROR_CODE=%ERRORLEVEL%

:end
@ENDLOCAL & SET ERROR_CODE=%ERROR_CODE%

IF NOT "%MVNW_VERBOSE%"=="true" GOTO mavenEnd
echo Finished with error: %ERROR_CODE%

:mavenEnd
EXIT /B %ERROR_CODE%
