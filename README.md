<!--
Copyright 2023 The DAPHNE Consortium

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Daphne UI

This tool is used as a web interface for running [DAPHNE](https://github.com/daphne-eu/daphne) either locally or at VEGA HPC. 

**Note that DAPHNE must be already build and ready to run before using the Web UI.**

## Requirements

In order to run the UI you need to install Node.js and npm package manager for the frontend and Python along with flask for the backend API. 

| tool/lib                             | version known to work (*)    | comment                                                                                                                                 |
|--------------------------------------|------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| Node.js       | 18.16.0   | |
| npm           | 9.5.1
| Python        | 3.8.10    ||
| Flask         | 2.3.2     || 

## Structure

The tool consists of a Python Flask API server (the [backend](backend/)) which spawns and controls DAPHNE jobs and an Angular application (the [frontend](frontend/)) which the user interacts with through a browser.

## Web-UI

The frontend is built using Angular Framework. You can read more about how to run the angular app [here](frontend/README.md). During development the frontend can be served by a seperate node server (using `ng serve`).

## API

The Flask API server controls DAPHNE jobs and responds with outputs/errors to the frontend. You can read more on how to run the backend API [here](backend/README.md).

## Configuration

[./backend/config.json](backend/config.json) needs to be configured in order to use the UI. 
Read more [here](./backend/README.md#configuration)
